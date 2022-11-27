
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace FtoWeb3.ServerInformation
{
    
    public class VersionsInfo
    {
        private string VersionPath { get; set; }

        public VersionsInfo(string rootPath)
        {
            VersionPath = rootPath;
        }
    
        public List<int> GetVersions()
        {
        
            List<string> versions = new List<string>();

            List<string> fileVersions =  Directory.GetFiles(Directory.GetCurrentDirectory()+VersionPath).ToList();

            foreach (var fileVersion in fileVersions)
                versions.Add( Path.GetFileNameWithoutExtension(fileVersion));

            return versions.Select(int.Parse).OrderByDescending(n=>n).ToList();
        }

        public int GetLatestVersion()
        {
            var versions = GetVersions();
            
            return versions[0];
        }
    

    }

    public static class VersionManager
    {
        public static readonly VersionsInfo SmartContractVersions = new VersionsInfo("/wwwroot/js/FtoWeb3Web3Versions/");
    }



}
