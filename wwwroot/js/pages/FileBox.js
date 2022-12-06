//selecting all required elements
var StepsPoints = document.getElementById("StepsPoints");
var DropArea = document.getElementById("drag-area");
var DragText = document.getElementById("FileLabel");
var input = document.getElementById("inputFile");
var ButtonFile = document.getElementById("buttonFile");
var BlurredLockScreenTitle = document.getElementById("blurredLockScreenTitle");


var Steps = document.getElementsByClassName('mainStep');
var ButtonStepCreate = document.getElementById("ButtonStepCreate");
var ButtonUploadingFile = document.getElementById("ButtonUploadingFile");
var VersionSelector = document.getElementById("VersionSelector");

var ProgressText = document.getElementById('ProgressText');
var OpenButtonPage = document.getElementById('OpenButtonPage');

var SelectedValue = document.getElementById('SelectedTextValue');
var SizeSlider = document.getElementById('SizeSlider');

var BlockSizeBox = document.getElementById('BlockSizeBox');

var DialogSteps = document.getElementById('dialogSteps');

var IsBlurred;

var FileInput;

var centerValue = SizeSlider.max/1.9;



(() =>
{
    SetBlurStatus();
    SetSliderBackgroundRange(centerValue);
    ChangeBlocksSize(centerValue);
    SizeSlider.value=centerValue;
})();

SizeSlider.addEventListener("input", (e)=>
{
    var inputValue = e.target.value;
    ChangeBlocksSize(inputValue);
    
    SetSliderBackgroundRange(inputValue);

    FileStatusSet(FileInput);
});

VersionSelector.addEventListener("change", ()=>
{
    let versionValue = VersionSelector.value;
    
    SetSmartContractVersion(versionValue);
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



DropArea.addEventListener("dragover", (event)=> {
    
    if (IsBlurred===false)
    {
        event.preventDefault();

        DragText.textContent = "Release to Upload File";
        DropArea.classList.add("active");

        StepsPoints.classList.add("hidden");
    }

    
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

ButtonFile.addEventListener("click", (event)=> {
    if (IsBlurred===false)
    {
        input.click(); 
    }
});

function SetBlurStatus()
{
    if (IsAuthorized())
    {
        IsBlurred = false;
        HiddenBlurLock();
    }
    else
    {
        IsBlurred = true;
        ShowBlurLock();
    }
}

function ShowBlurLock()
{
    hidden(BlurredLockScreenTitle.id,false);
    VersionSelector.disabled = true;
    AddBlur(DropArea.id);
}

function HiddenBlurLock()
{
    hidden(BlurredLockScreenTitle.id,true);
    VersionSelector.disabled = false;
    RemoveBlur(DropArea.id);
}

function SetSmartContractVersion(version)
{
    SmartContractVersion = parseInt(version);
    InitContract();
    if (FileInput != null)
        FileStatusSet(FileInput);
}

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
           OpenButtonPage.address=SmartContractVersion+"*"+id;
           hidden(BlockSizeBox.id,true)
           console.log(id);
           
           setCrateStatus(true);
           break;
   }
   
    ProgressText.innerHTML=text;
}

function getDialogStep(partId,completed) 
{
    let stepButton = document.createElement("button");
    
    let circle = document.createElement("div");
    
    stepButton.classList = "btn-step";
    stepButton.addEventListener("click", async ()=>
    {   
        try 
        {
            stepButton.disabled = true;
            circle.classList.add("loading");
            
            await fileUpload(FileInput,partId);
            
            circle.classList.add("completed");
            circle.classList.remove("loading");
        }
        catch
        {
            circle.classList.remove("loading");
            stepButton.disabled = false;
        }
        
    });
    
    if (completed) 
    {
        circle.classList = "step completed";
        stepButton.disabled = true;
    }   
    else 
    {
        circle.classList = "step";
    }
    
    stepButton.append(circle);
    
    let text = document.createElement("a");
    text.innerHTML = partId;
    stepButton.append(text);
    
    
    
    return stepButton;
}

async function OpenAndLoadDialog(file)
{
    let dialogId="UploadDialog"; 
    clearingDialog(DialogSteps);
    setAnimation(DialogSteps);
    
    showDialog(dialogId);
    
    await FilePartsMapSet(file,DialogSteps,dialogId);
}



function clearingDialog(dialogContent)
{
    dialogContent.innerText=null;
}

function setAnimation(dialogContent)
{
    let spainDiv = document.createElement("div");
    spainDiv.classList = "spin-wrapper";
    
    let spinnerDiv = document.createElement("div");
    spinnerDiv.classList = "spinner";
    
    spainDiv.append(spinnerDiv);

    dialogContent.append(spainDiv);
}

function isOpenDialog(id) 
{
    let dialog = document.getElementById(id);
    
    if (dialog.classList.contains("open"))
        return true;
    else
        return false;
    
}

function cancelDialog(id)
{
    let dialog = document.getElementById(id);
    dialog.classList.remove("open");

    dialog.close();
}


function showDialog(id)
{
    let dialog = document.getElementById(id);
    dialog.classList.add("open");
    
    dialog.showModal();

}
