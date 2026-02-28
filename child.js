/**
 * Este archivo se ejecuta como proceso hijo desde app.js con fork() las famosas ramas
 * process.send(...) permite enviar un mensaje al proceso padre
 * 
 */


process.send("Hola desde el proceso hijo");
