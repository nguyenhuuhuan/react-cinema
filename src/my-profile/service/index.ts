import axios from 'axios';
import { HttpRequest } from "axios-core";
import { useState } from "react";
import { options, storage } from "uione";
import { SkillClient } from "./skill";
import { SkillService } from "./skill/skill";
const httpRequest = new HttpRequest(axios, options);
export interface Config {
    skill_url:string;
  }
class ApplicationContext {
    skillService?:SkillService;
    getConfig(): Config {
      return storage.config();
    }
    getSkillService():SkillService{
      if(!this.skillService){
        const c = this.getConfig();
        this.skillService = new SkillClient(httpRequest, c.skill_url);
      }
      return this.skillService;
    }
  }
  
  export const context = new ApplicationContext();
  
  export function useSkillService():SkillService{
    const [service] = useState(()=> {return context.getSkillService()})
    return service;
  }
 