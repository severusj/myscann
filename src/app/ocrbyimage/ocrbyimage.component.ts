import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { OcrService } from '../ocr.service';
import { Observable } from 'rxjs/Observable';
import * as Tesseract from 'tesseract.js';
//import domtoimage from 'dom-to-image';
import * as jsPDF from 'jspdf';
import * as $ from 'jquery';
import * as docx from "docx";
import * as fs from "fs";
import { Document, Packer, Paragraph, TextRun } from "docx";


@Component({
  selector: 'app-ocrbyimage',
  templateUrl: './ocrbyimage.component.html',
  styleUrls: ['./ocrbyimage.component.scss']

})
export class OcrbyimageComponent implements OnInit {
  image: string = null;
  text: string;
  status: string;
  confidence;
  inputValue: string;

  constructor() { }

  ngOnInit() {
  }

  recognize(img: string) {
    Tesseract.recognize(img)
      .progress((progress) => {
        this.confidence = progress.progress;
        this.status = progress.status;
      })
      .catch(err => console.log(err))
      .then((value) => {
        this.text = value.text;
        this.confidence = value.confidence;
      })
      .finally(resultOrError => console.log(resultOrError));
  }

  onFileSelected(event) {
    this.image = event.target.files[0];
    console.log(event.target.files[0]);
  }

  validarImagen() {
    if (this.image == null) {
      var btnAbrirPopup = document.getElementById('btn-abrir-popup'),
        overlay = document.getElementById('overlay'),
        popup = document.getElementById('popup'),
        btnCerrarPopup = document.getElementById('btn-cerrar-popup');

      btnAbrirPopup.addEventListener('click', function () {
        overlay.classList.add('active');
        popup.classList.add('active');
      });

      btnCerrarPopup.addEventListener('click', function (e) {
        e.preventDefault();
        overlay.classList.remove('active');
        popup.classList.remove('active');
      });
    }
    else if (this.image != null) {
      this.onUpload();
    }

  }

  onUpload() {

    this.recognize(this.image);
  }


  crearPdf() 
  {


    var documentitouwu = new jsPDF('p', 'pt', 'letter');
    var ta = document.getElementById('texto');
    var nombre = document.getElementById('nombrepdf');
    documentitouwu.fromHTML(ta, 15, 15);
    var f = new Date();
    var n = f.getDate() + "/" + (f.getMonth() + 1) + "/" + f.getFullYear();

    documentitouwu.save('My Scann OCR' + '.pdf');

  }

 Export2Doc(element, filename = '') {
    
  var valorTexto= document.getElementById(element).innerHTML;
  var btnBlock = document.getElementById('dwlddoc');
  if (valorTexto == null) {
   btnBlock.setAttribute('disabled','disabled');
  }
  else {
  var html = document.getElementById(element).innerHTML;
  var blob = new Blob([''], {
   type: 'application/word'
  });

  //     // Especificamos la URL y el meta Charset con utf-8 para que sea legible
  var url = 'data:application/vnd.word;charset=utf-8-sig,' + encodeURIComponent(html);

  //     // Le damos un nombre al archivo con su extension
   filename = filename ? `${filename}.doc` : 'document.docx';

  //     // Creamos un link (abstracto) para descargar el archivo 
   var downloadLink = document.createElement("a");

  document.body.appendChild(downloadLink);

  if (navigator.msSaveOrOpenBlob) {
   navigator.msSaveOrOpenBlob(blob, filename);
   } else {
  //       // Creamos un link para el archivo
   downloadLink.href = url;

  //       // Configuramos el nombre ya seteado
  downloadLink.download = filename;

    //Mandamos a llamar la funcion del Link con una funcion
   downloadLink.click();
   }

  }

  document.body.removeChild(downloadLink);
  }
  ExportTxt(element, filename = '') {
   var html = document.getElementById(element).innerHTML;

  var blob = new Blob([''], {
    type: 'txt'
    });

  //   // Especificamos la URL y el meta Charset con utf-8 para que sea legible
  var url = 'data:application/vnd.word;charset=utf-8-sig,' + encodeURIComponent(html);

  //   // Le damos un nombre al archivo con su extension
   filename = filename ? `${filename}.txt` : 'document.txt';

    // Creamos un link (abstracto) para descargar el archivo 
   var downloadLink = document.createElement("a");

     document.body.appendChild(downloadLink);

    if (navigator.msSaveOrOpenBlob) {
      navigator.msSaveOrOpenBlob(blob, filename);
   } else {
       // Creamos un link para el archivo
    downloadLink.href = url;

  //     // Configuramos el nombre ya seteado
    downloadLink.download = filename;

  //     Mandamos a llamar la funcion del Link con una funcion
    downloadLink.click();
    }

     document.body.removeChild(downloadLink);
   }
   
}