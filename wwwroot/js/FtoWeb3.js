function downloadBase64(data,fileName)
{
    const linkSource = data;
    const downloadLink = document.createElement("a");

    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
}

function GetSmartContractVersion(id) 
{
    return parseInt(id.split('*')[0]);
}

function getIdWithoutVersion(id)
{
    return id.split('*')[1];
}

function normalizeName(fullName,maximumLineSize) 
{
    if (fullName.length<=maximumLineSize)
    {
        return fullName;
    }
    else 
    {
        return fullName.substring(0,maximumLineSize)+"...";
    }
    
}



const getBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});


function changeVideoSource(url)
{
    var video = document.getElementById('video');
    video.src = url;
    video.play();
}

function GetFileId(base64)
{
   var hash = CryptoJS.SHA256(base64).toString();
   var extension = GetExtension(base64);
   
   return extension+hash;
}

function SplitFile(base64,blockSize4)
{
    const pattern = new RegExp(".{1," + blockSize4 + "}", "ig");

    return base64.match(pattern).map(item => item.padEnd(blockSize4,""));
   
}


function GetExtension(base64)
{
    return base64.split(';')[0].split('/')[1];
}

function fileObject() 
{
    this.FileId;
    
    this.SplitFile;
    
    this.IsFileExist;
}

async function GetFileObject(file) 
{
    var data = await getBase64(file);


    var FileObject = new fileObject();
    
    FileObject.FileId = GetFileId(data);

    FileObject.IsFileExist = await Web3FileExist(FileObject.FileId);
    
    if (FileObject.IsFileExist)
    {
        var fileBlock = await Web3GetBlockSize(FileObject.FileId);
        
        FileObject.SplitFile = SplitFile(data,fileBlock);
    }
   else 
   {
       FileObject.SplitFile=SplitFile(data,SizeSlider.value);
   }
    
    return FileObject;
}

function getBase64FileSize(fileBase64)
{
    return new Blob([fileBase64]).size;
}

function fileSizeNormalization(byte)
{
    var num = 1024.00; //1-KByte

    if (byte < num)
        return byte + "B";

    if (byte < Math.pow(num, 2))
        return (byte / num).toFixed(2) + "K";

    if (byte < Math.pow(num, 3))
        return (byte / Math.pow(num, 2)).toFixed(2) + "M";

    if (byte < Math.pow(num, 4))
        return (byte / Math.pow(num, 3)).toFixed(2) + "G";

    return (byte / Math.pow(num, 4)).toFixed(2) + "T";
}

function FileUploadVersionSwitcher(file) 
{
    FileStatusSet(file);
    
    switch (SmartContractVersion) 
    {
        case 9:
        {
            fileUpload(file);
            
            break;  
        }
        default:
        {
            OpenAndLoadDialog(file);
        }
    }
} 

async function fileUpload(file,partId=null)
{
    let part;

    let FileObject = await GetFileObject(file);
    
    if (FileObject.IsFileExist)
    {
        if (partId==null)
        {
            let fileWeb3Size = parseInt(await Web3GetPartsLoaded(FileObject.FileId));
            part = fileWeb3Size+1;
            
            await Web3FileUpload(FileObject.FileId,FileObject.SplitFile[fileWeb3Size],part);
            
        }
        else
        {
            part = partId;
            
            await Web3FileUpload(FileObject.FileId,FileObject.SplitFile[part-1],part);
            
        }
        
    }
    else 
    {
        alert("File does not exist")
    }
  

}
async function FileCreate(file)
{
    var FileObject = await GetFileObject(file);
    
    console.log(FileObject.FileId);
    console.log(FileObject.SplitFile.length);
            
    await Web3CrateFile(FileObject.FileId,file.name,FileObject.SplitFile.length);
}

async function FileStatusSet(file)
{
    var FileObject = await GetFileObject(file);
    
    var splitFileSize = FileObject.SplitFile.length;
            
    if (FileObject.IsFileExist)
    {
        var fileWeb3Size = await Web3GetPartsLoaded(FileObject.FileId);
                
        if (fileWeb3Size===splitFileSize.toString())
        {
            setProgressPoint(3,fileWeb3Size+"/"+splitFileSize,FileObject.FileId);
        }
        else 
        {
            setProgressPoint(2,fileWeb3Size+"/"+splitFileSize,FileObject.FileId);
        }
                
    }
    else 
    {
        setProgressPoint(1,"0/"+splitFileSize,FileObject.FileId);
    }
            
}
async function FilePartsMapSet(file,dialogSteps,dialogId)
{
    let FileObject = await GetFileObject(file);
    
    let splitFileSize = FileObject.SplitFile.length;

    let isPartVoid;
    
    if (FileObject.IsFileExist)
    {
        for (let i=1;splitFileSize>=i;i++)
        {

            let part = await Web3GetFilePart(FileObject.FileId,i);
            
            if (part!=='')
                isPartVoid=true;
            else
                isPartVoid=false;
            
            if (i===1)
                clearingDialog(dialogSteps);
            
            
            if (isOpenDialog(dialogId))
            {
                dialogSteps.append(getDialogStep(i,isPartVoid));
                
                await new Promise(r => setTimeout(r, 100));
            }
            else 
            {
                break;
            }
            
        }
    

    }
   
    
}