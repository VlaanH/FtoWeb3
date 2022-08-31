//selecting all required elements
var StepsPoints = document.getElementById("StepsPoints");
var DropArea = document.getElementById("drag-area");
var DragText = document.getElementById("FileLabel");
var input = document.getElementById("inputFile");

var Steps = document.getElementsByClassName('step');
var ButtonStepCreate = document.getElementById("ButtonStepCreate");
var ButtonUploadingFile = document.getElementById("ButtonUploadingFile");

var ProgressText = document.getElementById('ProgressText');
var OpenButtonPage = document.getElementById('OpenButtonPage');

var SelectedValue = document.getElementById('SelectedTextValue');
var SizeSlider = document.getElementById('SizeSlider');

var BlockSizeBox = document.getElementById('BlockSizeBox');


var FileInput;

var centerValue=SizeSlider.max/1.9;

SetSliderBackgroundRange(centerValue);
ChangeBlocksSize(centerValue);
SizeSlider.value=centerValue;

SizeSlider.addEventListener("input", (e)=>
{
    var inputValue = e.target.value;
    ChangeBlocksSize(inputValue);
    
    SetSliderBackgroundRange(inputValue);

    FileStatusSet(FileInput);
});


input.addEventListener("change", function(){

    let _fileInput = this.files[0];

    if (_fileInput!=null)
    {
        FileInput=_fileInput;
        DropArea.classList.add("active");
        DragText.textContent = FileInput.name;

        StepsPoints.classList.remove("hidden");
        FileStatusSet(FileInput);
    }
    
    
});



DropArea.addEventListener("dragover", (event)=>{
    event.preventDefault(); 

    DragText.textContent = "Release to Upload File";
    DropArea.classList.add("active");

    StepsPoints.classList.add("hidden");
    
});


DropArea.addEventListener("dragleave", ()=>{
    
    SetDefaultBoxStatus();

});


DropArea.addEventListener("drop", (event)=>{
    event.preventDefault();

    FileInput = event.dataTransfer.files[0];

    DragText.textContent = FileInput.name;
    
    StepsPoints.classList.remove("hidden");
    
    FileStatusSet(FileInput);
    
});

function ChangeBlocksSize(value) 
{
    SelectedValue.innerHTML = "Block size: "+(value/1000).toFixed(2) +" KB";
} 


function SetSliderBackgroundRange(value)
{
    var percent= ((value-500)/SizeSlider.max)*100;

    SizeSlider.style="Background:linear-gradient(to right, rgb(170, 178, 189) "+percent+"%, rgb(241, 241, 241)"+percent+"%";
}

function SetDefaultBoxStatus()
{
    StepsPoints.classList.add("hidden");
    DropArea.classList.remove("active");
    DragText.textContent = "Drag & Drop to Upload File";
}


function setCrateStatus(status) 
{
    if(status===true)
        document.getElementById('CrateText').innerHTML = "Created";
    else
        document.getElementById('CrateText').innerHTML = "Create";
} 


function setProgressPoint(pointPosition,text,id)
{
    for(var i=0;Steps.length>i;i++)
    {
        if(i>pointPosition-1)
        {
            Steps[i].classList.remove("completed");
        }
        else
        {
            Steps[i].classList.add("completed");
        }
    }
    document.getElementsByClassName('percent')[0].style.width = `${((pointPosition-1)*50)}%`;
    
   switch (pointPosition) 
   {
       case 1:
           ButtonStepCreate.disabled = false;
           ButtonUploadingFile.disabled = true;
           OpenButtonPage.disabled = true;
           hidden(BlockSizeBox.id,false)
           
           setCrateStatus(false);
           break;
       case 2:
           ButtonStepCreate.disabled = true;
           ButtonUploadingFile.disabled = false;
           OpenButtonPage.disabled = true;
           hidden(BlockSizeBox.id,true)

           setCrateStatus(true);
           break;
       case 3:
           ButtonStepCreate.disabled = true;
           ButtonUploadingFile.disabled = true;
           OpenButtonPage.disabled = false;
           OpenButtonPage.address=id;
           hidden(BlockSizeBox.id,true)
           console.log(id);
           
           setCrateStatus(true);
           break;
   }
   
    ProgressText.innerHTML=text;
}