import { Injectable } from '@angular/core';
import { exportstatus } from '../components/scrape/cases/exportcases/exportcases.component';
import { ESRCH } from 'constants';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor() { }

  public checkuploadcomplete(chunkindex: number, uploadcount: number, totalrecords: number): exportstatusreturn {
    let esr = new exportstatusreturn()
    esr.chunkindex = chunkindex

    if (uploadcount == totalrecords) {
      esr.es.uploading = false
      esr.es.exporting = false
      esr.es.complete = true
    }
    else {
      esr.chunkindex = chunkindex + 1
    }
    return esr
  }

  
}



export class exportstatusreturn {
  es: exportstatus
  chunkindex: number
}