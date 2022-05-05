export interface SkillService{
    getSkills(q:string,max?:number):Promise<string[]|null>;
  }