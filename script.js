const regBGImage = /url\(([^\)]*)\), url\(([^\)]*)\), url\(([^\)]*)\)/

//=========================================================================================================
//Simple image loader function
function imageLoader(value) {
  fetch(value)
    .then(res => res.blob()) // Gets the response and returns it as a blob
    .then(blob => {return blob});
}

//=========================================================================================================
//Importing image to circle through drag and drop

function dragOverHandler(ev) {
  console.log('File(s) in drop zone');

  // Prevent default behavior (Prevent file from being opened)
  ev.preventDefault();
  
  ev.target.classList.remove("dragLeave");
  ev.target.classList.add("dragOver");
}
function dragLeaveHandler(ev) {
  console.log('File(s) left drop zone');

  // Prevent default behavior (Prevent file from being opened)
  ev.preventDefault();
  
  ev.target.classList.remove("dragOver");
  ev.target.classList.add("dragLeave");
}

function dropHandler(ev) {
  console.log('File(s) dropped');
  var file;
  var side;
  
  // Prevent default behavior (Prevent file from being opened)
  ev.preventDefault();
  
  ev.target.classList.remove("dragOver");
  ev.target.classList.add("dragLeave");
  setTimeout(function(){ev.target.classList.remove("dragLeave");}, 300);
  
  //Check on which part of the circle the file was dragged into
  if (ev.offsetX < ev.target.clientWidth/3) side = 'left'
  else if (ev.offsetX > ((ev.target.clientWidth/3)*2)) side = 'right';
  else side = 'center';
  
  //console.log(side);
  if (ev.dataTransfer.items) {
    // Use DataTransferItemList interface to access the file(s)
    // If dropped items aren't files, reject them
    if (ev.dataTransfer.items[0].kind === 'file') {
      file = ev.dataTransfer.items[0].getAsFile();
    }
  } else {
    // Use DataTransfer interface to access the file(s)
    for (var i = 0; i < ev.dataTransfer.files.length; i++) {
      file = ev.dataTransfer.files[0];
    }
  }
  if (file) {
    file = URL.createObjectURL(file)
    //document.querySelector("#drop").style.backgroundImage = "url('" + file + "')";
    cropperOn(file, ev.target, side);
  }
}

function addCircleImage(canvas, elem, side) {
  console.log(canvas, elem, side);
  if (side == 'center') {
    elem.classList.add("single");
    elem.style.backgroundImage = "url('assets/black.png'), url('" + canvas + "')";
  }
  else {
    elem.classList.remove("single");
    let regExResult = elem.style.backgroundImage.match(regBGImage);
    if (regExResult == null) {regExResult = ["", "assets/black.png", "", ""];}
    
    if (side == 'left') {
      elem.style.backgroundImage = "url(" + regExResult[1] + "), url(" + canvas + "), url(" + regExResult[3] + ")";
      console.log(elem.style.backgroundImage);
    }
    else if (side == 'right') {
      elem.style.backgroundImage = "url(" + regExResult[1] + "), url(" + regExResult[2] + "), url(" + canvas + ")";
    }
  }
}

function cropperOn(file, elem, side) {
    document.querySelector("#cropperImage").src = file;
    document.querySelector(".imageCropContainer").style.display = "flex";
    
    let image = document.getElementById('cropperImage');
    let aspect;
    
    if (side == 'center') aspect = 1/1;
    else aspect = 1/2;
    
    let cropper = new Cropper(image, {
      aspectRatio: aspect,
      viewMode: 1,
      dragMode: 'move',
      guides: false,
      autoCropArea: 1,
      wheelZoomRatio: 0.2,
      toggleDragModeOnDblclick: false,
      crop(event) {},
      ready() {
        document.querySelector(".cropContainer > button").addEventListener("click", cropperDone);
        
        let cropperElems = document.querySelectorAll(".cropper-view-box, .cropper-face");
        for (let i = 0; i < cropperElems.length; i++) {
          cropperElems[i].classList.add(side);
        }
      }
    });

    function cropperDone(ev) {
      let result = cropper.getCroppedCanvas();
      result.toBlob(function (canvas){ addCircleImage(URL.createObjectURL(canvas), elem, side);});
      
      document.querySelector(".imageCropContainer").style.display = "none";
      document.querySelector(".cropContainer > button").removeEventListener("click", cropperDone);
      cropper.destroy();
    }
}

//=========================================================================================================
//Take screenshot of the Ryu area
function printScreen(ev) {
  // Prevent default behavior (Prevent file from being opened)
  ev.preventDefault();
  
  var area = document.querySelector(".mainContainer");

  domtoimage.toPng(area)
      .then(function (dataUrl) {
          var img = document.querySelector(".bottomRow > img");
          img.src = dataUrl;
      })
      .catch(function (error) {
          console.error('oops, something went wrong!', error);
      });
}

//=========================================================================================================
//Reset empty text

function textReset(ev) {
  let elem = ev.target;
  if (elem.innerHTML == "") {
    if (elem.classList.contains("name")) {
      elem.innerHTML = "Name"
    } else {
      elem.innerHTML = "Game"
    }
  }
}

//=========================================================================================================
//Circle template
const columnTemplate = document.createElement("div");

for (let i = 0; i < 5; i++) {
  let classes = ["intersection", "stretch", "game low", "name", "circle"];
  let tempnode = document.createElement("div");
  tempnode.className = classes[i]
  columnTemplate.appendChild(tempnode);
}

columnTemplate.children[0].appendChild(document.createElement("div"));

columnTemplate.children[2].spellcheck = false;
columnTemplate.children[2].contentEditable = true;
columnTemplate.children[2].addEventListener('focusout', textReset);
columnTemplate.children[2].appendChild(document.createTextNode("Game"));

columnTemplate.children[3].spellcheck = false;
columnTemplate.children[3].contentEditable = true;
columnTemplate.children[3].addEventListener('focusout', textReset);
columnTemplate.children[3].appendChild(document.createTextNode("Name"));

columnTemplate.children[4].addEventListener('drop', dropHandler);
columnTemplate.children[4].addEventListener('dragover', dragOverHandler);
columnTemplate.children[4].style.backgroundImage = "url(assets/black.png), url(), url()";

function createColumn(number) {
  let template = columnTemplate.cloneNode(true);
  
  template.children[0].style.gridColumnStart = (1 + number*3) * -1
  let numberlist = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"]
  template.children[0].children[0].style.backgroundImage = "url('assets/" + number + ".png')";
  
  template.children[1].style.gridColumnStart = (1 + number*3) * -1
  template.children[2].style.gridColumnStart = (2 + number*3) * -1
  template.children[3].style.gridColumnStart = (3 + number*3) * -1
  template.children[4].style.gridColumn = (2 + number*3) * -1
  
  if (number%2 == 1) {
    template.children[1].remove();
    template.children[1].classList.remove("low");
  }
  return template.children;
}

//=========================================================================================================
//Adding or removing circles
var circleAmount = 0;

function addColumn() {
  if (circleAmount >= 10) {return}
  circleAmount++
  
  let container = document.querySelector(".mainContainer");
  let output = createColumn(circleAmount);
  
  for (let i = 0; i < output.length;) {
    container.appendChild(output[i]);
  }
}

function removeColumn() {
  if (circleAmount <= 1) {return}
  let container = document.querySelector(".mainContainer");
  
  for (let i = 0; i < (5 - circleAmount%2); i++) {
    container.lastChild.remove();
  }
  
  circleAmount--
}

addColumn();

//=========================================================================================================
//Adding dynamic event handlers
document.querySelector(".mainContainer").addEventListener('drop', function (e) {
  if (e.target.classList.contains("circle") && e.target.id != "ryu") {
    dropHandler(e);
  }
});

document.querySelector(".mainContainer").addEventListener('dragover', function (e) {
  if (e.target.classList.contains("circle") && e.target.id != "ryu") {
    dragOverHandler(e);
  }
});

document.querySelector(".mainContainer").addEventListener('dragleave', function (e) {
  if (e.target.classList.contains("circle") && e.target.id != "ryu") {
    dragLeaveHandler(e);
  }
});

document.querySelector(".mainContainer").addEventListener('focusout', function (e) {
  if (e.target.classList.contains("name") || e.target.classList.contains("game")) {
    textReset(e);
  }
});

document.querySelector(".mainContainer").addEventListener('paste', function (e) {
  if (e.target.hasAttribute("contenteditable")) {
    contentNoStyle(e);
  }
});

function contentNoStyle(e) {
  e.preventDefault()
  var text = e.clipboardData.getData('text/plain')
  document.execCommand('insertText', false, text)
};