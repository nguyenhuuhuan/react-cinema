import { HttpRequest } from "axios-core";
import { DataLoader } from "onecore";
import { PreviousSkillSuggestion, SkillService, SkillSuggestion } from "./skill";

export class SkillClient implements SkillService, DataLoader<string>{
    constructor(private http:HttpRequest, private url:string){
      this.loadData = this.loadData.bind(this);
    }
    getSkills(q:string,max?:number):Promise<string[]>{
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
    loadData(keyWords: string, max: number, ctx?: any): Promise<string[]> {
      let query = this.url+`?keyword=${keyWords}`;
      if(max)query+=`&max=${max}`    
      return this.http.get<string[]>(query).catch(err=>{
        const data = (err && err.response)?err.response:err;
        if (data && (data.status === 404 || data.status === 410)) {
          return [];
        }
        throw err;
      });
    }
    // async getSkillSuggestion(keyword:string, previousSkillSuggestion:PreviousSkillSuggestion,max:number,displayField:string):Promise<SkillSuggestion> {
    //   if (
    //     keyword.length > 1 && keyword.startsWith(previousSkillSuggestion.previousKeyWord) &&
    //     previousSkillSuggestion.result.length < max
    //   ) {
    //     let response;
    //     keyword = keyword.toUpperCase();
    //     if (displayField !== '') {
    //       response = previousSkillSuggestion.result.filter(item => (item as any)[displayField].toUpperCase().includes(keyword));
    //     } else {
    //       response = previousSkillSuggestion.result.filter(item => String(item).toUpperCase().includes(keyword));
    //     }
    //     return Promise.resolve({ response, previousSkillSuggestion });
    //   }
    //   else {
    //     let response = await this.getSkills(keyword, max);
    //     // if (excludingValues.length > 0) {
    //     //   if (this.valueField !== '') {
    //     //     response = response.filter(obj => !excludingValues.find(item => (obj as any)[this.valueField] === item));
    //     //   } else {
    //     //     response = response.filter(obj => !excludingValues.find(item => obj === item));
    //     //   }
    //     // }
    //     previousSkillSuggestion.previousKeyWord = keyword;
    //     previousSkillSuggestion.result = response;
    //     return { response, previousSkillSuggestion };
    //   }
    // }
  }
