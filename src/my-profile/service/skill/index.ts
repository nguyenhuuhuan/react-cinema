import { HttpRequest } from "axios-core";
import { SkillService } from "./skill";

export class SkillClient implements SkillService{
    constructor(private http:HttpRequest, private url:string){
    }
    getSkills(q:string,max?:number):Promise<string[]|null>{
      let query = this.url+`?keyword=${q}`;
      if(max)query+=`&max=${max}`    
      return this.http.get<string[]>(query).catch(err=>{
        const data = (err && err.response)?err.response:err;
        if (data && (data.status === 404 || data.status === 410)) {
          return [];
        }
        throw err;
      });
    }
  }
