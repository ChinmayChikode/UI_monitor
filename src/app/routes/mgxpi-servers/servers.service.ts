import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { urls } from '@env/accessurls';
import { ProjectSelection } from '../admin-layout/sidemenu/projectselection.service';


export interface ServerInstance {
  Server_host;
  Alterate_host;
  project_directory;
  Number_of_instances;
  Load_Triggers;
  Load_Schedulers;
  Load_auto_start;
  Number_of_workers;
}

@Injectable({
  providedIn: 'root'
})
export class ServersService {

  Server_host:String;
  Alternate_host:String;
  project_directory:String;
  Number_of_instances: Number;
  Load_Triggers: boolean;
  Load_Schedulers: boolean;
  Load_auto_start: boolean;
  Number_of_workers:Number;     
     
  ServerInstance:ServerInstance[];


  constructor(private http: HttpClient) { }

  
  form: FormGroup = new FormGroup({
    Server_host: new FormControl('', [Validators.required,Validators.minLength(1)]),
    Alternate_host: new FormControl(''),
    project_directory: new FormControl('',[Validators.required,Validators.minLength(1)]),
    Number_of_instances: new FormControl('',[Validators.required]),
    Load_Triggers: new FormControl(false),
    Load_Schedulers: new FormControl(false),
    Load_auto_start: new FormControl(false),
    Number_of_workers: new FormControl('',[Validators.required])
  
  });

  initializeFormGroup() {
    this.form.setValue({
      Server_host: '',
      Alternate_host: '',
      project_directory: '',
      Number_of_instances: '',
      Load_Triggers: false,
      Load_Schedulers: false,
      Load_auto_start: false,
      Number_of_workers:''        
  
    });
   
  }

  SaveFormGroup(serverdetails,inputProjectKey: any) {

  console.log("Inside saveformgroup");  
  console.log(serverdetails); 
  

  const body = {
    Server_host: serverdetails.Server_host,
    Alternate_host: serverdetails.Alternate_host,
    project_directory: serverdetails.project_directory,
    Number_of_instances: serverdetails.Number_of_instances,
    Load_Triggers: serverdetails.Load_Triggers,
    Load_Schedulers: serverdetails.Load_Schedulers,
    Load_auto_start: serverdetails.Load_auto_start,
    Number_of_workers: serverdetails.Number_of_workers
  };

   console.log(body);

   const tokenHeaders = new HttpHeaders(
    {
      'Content-Type': 'application/json',
      Authorization: 'Basic ' + btoa('admin:admin'),
      Accept: 'application/json'
    }
  );

  var projectkey = inputProjectKey;

  let params = new HttpParams();

    //  params = params.append('Server_host',projectKey);
    //  console.log(projectKey);
    params = params.append('Server_host', body.Server_host);
    console.log(body.Server_host);
    params = params.append('Alternate_host', body.Alternate_host);
    params = params.append('project_directory',body.project_directory);
    params = params.append('Number_of_instances',body.Number_of_instances);
    params = params.append('Load_triggers',body.Load_Triggers);
    params = params.append('Load_Schedulers',body.Load_Schedulers);
    params = params.append('Load_auto_start',body.Load_auto_start);
    params = params.append('Number_of_workers',body.Number_of_workers);

  this.http.get(urls.SERVER_URL + urls.NewServerInstance + projectkey, { headers: tokenHeaders,params})
  .subscribe(
    (tokenResponse: any) => {
       
       //this.ServerInstance=tokenResponse;

      console.log(tokenResponse);
      
      
    },
    (errorResponse: any) => {
      console.log(errorResponse);
 
    }
  );

 
    


   
  }






}
