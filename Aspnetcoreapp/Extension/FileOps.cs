using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion.Internal;
using OfficeOpenXml;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace Aspnetcoreapp.Extension
{
    public class FileOps
    {
        [NonAction]
        public FileInfo getlatestexcelfile(string path)
        {
            var directory = new DirectoryInfo(System.IO.Directory.GetCurrentDirectory() + "/data/" + path);

            if (!directory.Exists)
            {
                return null;
            }


            var myFile = (from f in directory.GetFiles()
                              //where f.Extension.ToString() == "xlsx"
                          orderby f.LastWriteTime descending
                          select f).First();

            while (myFile.Extension == ".crdownload")//wait for the file to finish downloading
            {
                System.Threading.Thread.Sleep(50);
                myFile = (from f in directory.GetFiles()
                              //where f.Extension.ToString() == "xlsx"
                          orderby f.LastWriteTime descending
                          select f).First();
            }
            // Debug.WriteLine(myFile);

            //var filereplace = myFile.FullName.Replace("/", "_");
            return myFile;
        }
        [NonAction]
        public ExcelPackage getlatestexcelpackage(string path)
        {
            System.Threading.Thread.Sleep(5000);

            FileInfo file = getlatestexcelfile(path);

            if (file == null)
            {
                return null;
            }

            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
            ExcelPackage ws = new ExcelPackage(file);

            return ws;
        }
        [NonAction]
        public void removelatestexcelfile(string path)
        {

            var file = getlatestexcelfile(path);
            if (file == null)
            {
            }
            else
            {
                DirectoryInfo dir = file.Directory;

                foreach (var f in dir.GetFiles())
                {
                    f.Delete();
                }

                dir.Delete();
            }

        }
    }
}
