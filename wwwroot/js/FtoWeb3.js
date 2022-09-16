function downloadBase64(data,fileName,extension)
{
    const linkSource = data;
    const downloadLink = document.createElement("a");

    downloadLink.href = linkSource;
    downloadLink.download = fileName+"."+extension;
    downloadLink.click();
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


async function FileUpload(file)
{
    FileStatusSet(FileInput);

    var FileObject = await GetFileObject(file);
    
    if (FileObject.IsFileExist)
    {
        var fileWeb3Size = parseInt(await Web3GetFileSize(FileObject.FileId));
                
        await Web3FileUpload(FileObject.FileId,FileObject.SplitFile[fileWeb3Size],fileWeb3Size+1);
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
            
    await Web3CrateFile(FileObject.FileId,file.name);
}

async function FileStatusSet(file)
{
    var FileObject = await GetFileObject(file);
    
    var splitFileSize = FileObject.SplitFile.length;
            
    if (FileObject.IsFileExist)
    {
        var fileWeb3Size = await Web3GetFileSize(FileObject.FileId);
                
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