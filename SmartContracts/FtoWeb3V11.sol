pragma solidity 0.8.7;


contract FtoWeb3
{

    function char(bytes1 b) internal pure returns (bytes1 c)
    {
        if (uint8(b) < 10)
            return bytes1(uint8(b) + 0x30);
        else
            return bytes1(uint8(b) + 0x57);
    }

    function toString(uint256 x)internal pure returns (string memory)
    {
        if (x == 0)
        {
            return "0";
        }
        uint256 j = x;
        uint256 length;
        while (j != 0)
        {
            length++;
            j /= 10;
        }
        bytes memory bstr = new bytes(length);
        uint256 k = length;
        j = x;
        while (j != 0)
        {
            bstr[--k] = bytes1(uint8(48 + j % 10));
            j /= 10;
        }
        return string(bstr);
    }

    function toString(bool x) internal pure returns (string memory)
    {
        if(x==true)
        {
            return "true";
        }
        else
        {
            return "false";
        }
    }

    function toString(address x) internal pure returns (string memory)
    {
        bytes memory s = new bytes(40);
        for (uint i = 0; i < 20; i++)
        {
            bytes1 b = bytes1(uint8(uint(uint160(x)) / (2**(8*(19 - i)))));
            bytes1 hi = bytes1(uint8(b) / 16);
            bytes1 lo = bytes1(uint8(b) - 16 * uint8(hi));
            s[2*i] = char(hi);
            s[2*i+1] = char(lo);
        }
        return string(s);
    }
    function toString(address[]memory x) internal pure returns (string[] memory)
    {
        string[] memory xArray = new string[](x.length);

        for (uint i = 0; i < x.length; i++)
        {
            xArray[i] = (toString(x[i]));
        }

        return xArray;
    }

    struct FileObj
    {
        address Owner;

        string[] Base64Data;

        string FileName;

        uint FileSize;

        uint PartsLoaded;

        bool Completed;

        string Id;

        uint BlockSize;
    }

    int public versions = 11;

    address payable public owner;
    FileObj[] fileObjs;

    constructor() payable
    {
        owner = payable(msg.sender);
    }



    function FileExist(string memory id) public view returns (bool)
    {
        bool IsFileExist = false;
        for (uint i=0;fileObjs.length>i;i++)
        {

            if( keccak256(abi.encodePacked(fileObjs[i].Id))==keccak256(abi.encodePacked(id)))
            {
                IsFileExist=true;
            }
        }

        return IsFileExist;
    }

    function GetNumberId(string memory id) private view returns (uint)
    {

        for (uint i=0;fileObjs.length>i;i++)
        {

            if(keccak256(abi.encodePacked(fileObjs[i].Id))==keccak256(abi.encodePacked(id)))
            {
                return i;
            }
        }


    }

    function GetFullBase64(string[] memory base64Data) private view returns (string memory)
    {
        string memory fullBase64;

        for (uint i=0;base64Data.length>i;i++)
        {
            fullBase64 = string(abi.encodePacked(base64Data[(base64Data.length-1)-i],fullBase64));
        }

        return fullBase64;
    }


    function CreateFile(string memory id,string memory fileName,uint blockSize,uint parts) public payable
    {

        if(FileExist(id))
        {
            require(false,"File exists");
        }
        else
        {
            address owner = payable(msg.sender);

            string[] memory voidsBase64 = new string[](parts);

            FileObj memory newFileObj = FileObj(owner,voidsBase64,fileName,0,0,false,id,blockSize);

            fileObjs.push(newFileObj);
        }


    }


    function AddFile(string memory id,string memory base64Data,uint partId) public payable
    {


        bool IsFileExist = FileExist(id);
        uint NumberId = GetNumberId(id);

        if(IsFileExist)
        {
            address sender = payable(msg.sender);



            if(fileObjs[NumberId].Owner==sender)
            {
                //void
                if(keccak256(abi.encodePacked(fileObjs[NumberId].Base64Data[partId-1]))==keccak256(abi.encodePacked("")))
                {
                    fileObjs[NumberId].PartsLoaded++;

                    fileObjs[NumberId].FileSize += bytes(base64Data).length;

                    fileObjs[NumberId].Base64Data[partId-1]=base64Data;
                }
                else
                {
                    require(false,"Sequence is broken");
                }


            }
            else
            {
                require(false,"You are not the owner");
            }

        }
        else
        {
            require(false,"file does not exist");
        }

    }


    function getFilePart(string memory id,uint part) public view returns(string memory)
    {
        bool IsFileExist=FileExist(id);
        uint numberId=GetNumberId(id);

        if(IsFileExist)
        {
            return fileObjs[numberId].Base64Data[part-1];
        }
        else
        {
            require(false,"file does not exist");
        }


    }
    function IsFilePartExist(string memory id,uint part) public view returns(bool)
    {
        bool isFileExist = false;
        if(keccak256(abi.encodePacked(getFilePart(id,part))) != keccak256(abi.encodePacked("")))
        {
            isFileExist = true;
        }
        return isFileExist;
    }


    function toJsonArray(string memory name,string[] memory data) private view returns(string memory)
    {

        string memory fullJson;

        string memory openJson="{";

        string memory arrayName = string(abi.encodePacked("\"",name,"\":","["));

        string memory _data;

        uint maxFileParts = data.length;

        for (uint i=0;maxFileParts>i;i++)
        {

            _data = string(abi.encodePacked(_data,"\"",data[i],"\""));


            if(maxFileParts-1>i)
            {
                _data = string(abi.encodePacked(_data,","));
            }

        }

        string memory arrayNameclose = "]";


        string memory closeJson="}\n\r";

        fullJson = string(abi.encodePacked(openJson,arrayName,_data,arrayNameclose,closeJson));

        return fullJson;
    }

    function getJsonFileMap(string memory id) public view returns(string memory)
    {
        uint numberId=GetNumberId(id);


        uint maxFileParts = fileObjs[numberId].Base64Data.length;

        string[] memory FileMap = new string[](maxFileParts);

        for (uint i=0;maxFileParts>i;i++)
        {
            FileMap[i] = (toString(IsFilePartExist(id,i+1)));
        }


        return toJsonArray("PartsMap",FileMap);

    }

    function dynamicArrayAdd(string[] memory arrayData, string memory data) private view returns(string[] memory)
    {
        string[] memory newArrayData = new string[](arrayData.length+1);

        for (uint i=0;arrayData.length>i;i++)
        {
            newArrayData[i] = arrayData[i];
        }
        newArrayData[newArrayData.length-1] = data;

        return newArrayData;
    }


    function getJsonUsersFiles(address owner) public view returns(string memory)
    {
        uint maxFiles = fileObjs.length;

        string[] memory ownerFiles = new string[](0);

        for (uint i=0;maxFiles>i;i++)
        {
            if(fileObjs[i].Owner==owner)
            {
                ownerFiles = dynamicArrayAdd(ownerFiles,fileObjs[i].Id);
            }
        }

        return toJsonArray("OwnerFiles",ownerFiles);
    }

    function getFile(string memory id) public view returns(string memory)
    {
        bool IsFileExist=FileExist(id);
        uint numberId=GetNumberId(id);

        if(IsFileExist)
        {
            return GetFullBase64(fileObjs[numberId].Base64Data);
        }
        else
        {
            require(false,"file does not exist");
        }

    }

    function getFileSize(string memory id) public view returns(uint)
    {
        bool IsFileExist=FileExist(id);
        uint numberId=GetNumberId(id);

        if(IsFileExist)
        {
            return fileObjs[numberId].FileSize;
        }
        else
        {
            require(false,"file does not exist");
        }

    }

    function getFileOwner(string memory id) public view returns(address)
    {
        bool IsFileExist=FileExist(id);
        uint numberId=GetNumberId(id);

        if(IsFileExist)
        {
            return fileObjs[numberId].Owner;
        }
        else
        {
            require(false,"file does not exist");
        }
    }


    function getPartsLoaded(string memory id) public view returns(uint)
    {
        bool IsFileExist=FileExist(id);
        uint numberId=GetNumberId(id);

        if(IsFileExist)
        {
            return fileObjs[numberId].PartsLoaded;
        }
        else
        {
            require(false,"file does not exist");
        }

    }

    function getFileName(string memory id) public view returns(string memory)
    {
        bool IsFileExist=FileExist(id);
        uint numberId=GetNumberId(id);

        if(IsFileExist)
        {
            return fileObjs[numberId].FileName;
        }
        else
        {
            require(false,"file does not exist");
        }

    }


    function getBlockSize(string memory id) public view returns(uint)
    {
        bool IsFileExist=FileExist(id);
        uint numberId=GetNumberId(id);

        if(IsFileExist)
        {
            return fileObjs[numberId].BlockSize;
        }
        else
        {
            require(false,"file does not exist");
        }

    }
}
