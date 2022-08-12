function downloadBase64(data)
{
    const linkSource = data;
    const downloadLink = document.createElement("a");
    const fileName = "vct_illustration.mp4";

    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
}


function getBase64(file) 
{
    return new Promise((resolve, reject) =>
    {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}


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

function SplitFile(base64)
{
    return base64.split(/(.{9000})/).filter(O=>O);
}


function GetExtension(base64)
{
    return base64.split(';')[0].split('/')[1];
}


async function FileUpload(file)
{
    
    getBase64(file).then
    (
        async data => 
        {
            
            var fileId = GetFileId(data);
            
            var splitFile = SplitFile(data);
            
           
            if (await Web3FileExist(fileId))
            {
                var fileWeb3Size = parseInt(await Web3GetFileSize(fileId));
                
                await Web3FileUpload(fileId,splitFile[fileWeb3Size],fileWeb3Size+1);
            }
            else 
            {
                await Web3CrateFile(fileId,file.name);
            }
        }
    );

}
async function FileCreate(file)
{

    getBase64(file).then
    (
        async data =>
        {

            var fileId = GetFileId(data);

            var splitFile = SplitFile(data);


            console.log(fileId);
            console.log(splitFile.length);
            
            await Web3CrateFile(fileId,file.name);
           

        }
    );

}

async function FileStatusSet(file)
{
    getBase64(file).then
    (
        async data =>
        {

            var fileId = GetFileId(data);
            
            console.log(fileId);
            
            var splitFileSize = SplitFile(data).length;
            
            if (await Web3FileExist(fileId))
            {
                var fileWeb3Size = await Web3GetFileSize(fileId);
                
                if (fileWeb3Size===splitFileSize.toString())
                {
                    setProgressPoint(3,fileWeb3Size+"/"+splitFileSize,fileId);
                }
                else 
                {
                    setProgressPoint(2,fileWeb3Size+"/"+splitFileSize,fileId);
                }
                
            }
            else 
            {
                setProgressPoint(1,"0/"+splitFileSize,fileId);
            }
            

            
        }
    );
}