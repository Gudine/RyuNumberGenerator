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
}

function dropHandler(ev) {
  console.log('File(s) dropped');
  var file;
  // Prevent default behavior (Prevent file from being opened)
  ev.preventDefault();

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
    cropperOn(file, ev.target);
  }
}

function cropperOn(file, elem) {
    document.querySelector("#cropperImage").src = file;
    document.querySelector(".imageCropContainer").style.display = "flex";
    
    let image = document.getElementById('cropperImage');
    let cropper = new Cropper(image, {
      aspectRatio: 1/1,
      viewMode: 1,
      dragMode: 'move',
      guides: false,
      autoCropArea: 1,
      wheelZoomRatio: 0.2,
      toggleDragModeOnDblclick: false,
      crop(event) {},
      ready() {
        document.querySelector(".cropContainer > button").addEventListener("click", cropperDone);
      }
    });

    function cropperDone(ev) {
      let result = cropper.getCroppedCanvas();
      result.toBlob(function (canvas){elem.style.backgroundImage = "url('" + URL.createObjectURL(canvas) + "')"});
      
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