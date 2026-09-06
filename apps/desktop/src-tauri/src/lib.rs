use tauri::Manager;

#[tauri::command]
async fn start_oauth(app: tauri::AppHandle) -> Result<String, String> {
    let listener = std::net::TcpListener::bind("127.0.0.1:0")
        .map_err(|e| e.to_string())?;
    
    let port = listener.local_addr()
        .map_err(|e| e.to_string())?
        .port();

    let redirect_uri = format!("http://localhost:{}", port);
    let state = "autovault-state";
    
    let auth_url = format!(
        "https://accounts.google.com/o/oauth2/v2/auth?response_type=code&scope=openid%20email%20profile&redirect_uri={}&state={}",
        urlencoding::encode(&redirect_uri),
        state
    );

    // Usa el plugin opener para abrir el browser
    tauri_plugin_opener::open_url(&auth_url, None::<String>)
        .map_err(|e| e.to_string())?;

    let (mut stream, _) = listener.accept()
        .map_err(|e| e.to_string())?;

    let mut request = String::new();
    use std::io::BufRead;
    let reader = std::io::BufReader::new(&mut stream);
    for line in reader.lines() {
        let line = line.map_err(|e| e.to_string())?;
        if line.is_empty() { break; }
        request.push_str(&line);
        request.push('\n');
    }

    let code = request
        .lines()
        .next()
        .and_then(|line| line.split_whitespace().nth(1))
        .and_then(|path| {
            url::Url::parse(&format!("http://localhost{}", path)).ok()
        })
        .and_then(|url| {
            url.query_pairs()
                .find(|(k, _)| k == "code")
                .map(|(_, v)| v.into_owned())
        })
        .ok_or("No se encontró el código de autorización")?;

    use std::io::Write;
    let response = "HTTP/1.1 200 OK\r\nContent-Type: text/html\r\n\r\n\
        <html><body style='font-family:sans-serif;text-align:center;padding:40px'>\
        <h2>Autenticación exitosa</h2>\
        <p>Puedes cerrar esta ventana y volver a AutoVault.</p>\
        </body></html>";
    stream.write_all(response.as_bytes())
        .map_err(|e| e.to_string())?;

    Ok(code)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![start_oauth])
        .run(tauri::generate_context!())
        .expect("error while running AutoVault");
}