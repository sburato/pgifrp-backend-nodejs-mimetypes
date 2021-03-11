const http = require('http');
const url  = require('url');
const fs   = require('fs');
const path = require('path');

const hostname = '127.0.0.1';
const port = 3000;

const mimeTypes = {
  html: 'text/html',
  css : 'text/css',
  js  : 'text/javascript',
  png : 'image/png',
  jpeg: 'image/jpeg',
  jpg : 'image/jpg',
  woff: 'font/woof',
};

const server = http.createServer((request, response) => {      
  let acesso_uri = url.parse(request.url).pathname;  
  // 127.0.0.1:3000/index.html => acesso_uri = index.html

  let caminho_completo_recurso = path.join(process.cwd(), decodeURI(acesso_uri));
  //process.cwd() => C:\servidor\ + recurso
  console.log(caminho_completo_recurso);
  
  let recurso_carregado;
  try {
    recurso_carregado = fs.lstatSync(caminho_completo_recurso);   
  } catch (error) {
    response.writeHead(404, { 'Content-Type': 'text/plain' });
    response.write('404: Arquivo não encontrado.');
    response.end();    
  }

  if (recurso_carregado.isFile()) {
    let extensao = path.extname(caminho_completo_recurso).substring(1);
    // extname = .html
    // substring = html

    let mimeType = mimeTypes[extensao];    
    // html: 'text/html',
    // css : 'text/css',
    // js  : 'text/javascript',
    // png : 'image/png',
    // jpeg: 'image/jpeg',
    // jpg : 'image/jpg',
    // woff: 'font/woof',

    response.writeHead(200, {'Content-Type': mimeType});
    let fluxo_arquivo = fs.createReadStream(caminho_completo_recurso);
    fluxo_arquivo.pipe(response);
  } else if (recurso_carregado.isDirectory()) {
    response.writeHead(302, {'Location': 'index.html'});
    response.end();
  } else {
    response.writeHead(500, { 'Content-Type': 'text/plain' });
    response.write('500: Erro interno do servidor.');
    response.end();
  }
});

server.listen(port, hostname, () => {
  console.log(`Servidor web rodando em http://${hostname}:${port}/`);
});

