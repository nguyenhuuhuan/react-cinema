export interface DataLoader<T> {
    loadData(keyWords: string, max: number, ctx?: any): Promise<T[]>;
  }
  
  export interface SuggestionService<T> {
    getSuggestion(keyword: string, previousSuggestion: PreviousSuggestion<T>, ctx?: any): Promise<Suggestion<T>>;
  }
  
  export class PreviousSuggestion<T> {
    previousKeyWord!: string;
    result!: T[];
  }
  
  export class Suggestion<T> {
    response!: T[];
    previousSuggestion!: PreviousSuggestion<T>;
  }
  
  export class DefaultSuggestionService<T> implements SuggestionService<T> {
    constructor(
        private service: DataLoader<T>,
        private max: number,
        private displayField: string = '',
        private valueField: string = '') {
      this.getSuggestion = this.getSuggestion.bind(this);
    }
  
    async getSuggestion(keyword: string, previousSuggestion: PreviousSuggestion<T>, excludingValues: any[] = [], ctx?: any): Promise<Suggestion<T>> {
      if (
        keyword.length > 1 && keyword.startsWith(previousSuggestion.previousKeyWord) &&
        previousSuggestion.result.length < this.max
      ) {
        let response;
        keyword = keyword.toUpperCase();
        if (this.displayField !== '') {
          response = previousSuggestion.result.filter(item => (item as any)[this.displayField].toUpperCase().includes(keyword));
        } else {
          response = previousSuggestion.result.filter(item => String(item).toUpperCase().includes(keyword));
        }
        return Promise.resolve({ response, previousSuggestion });
      } else {
        let response = await this.service.loadData(keyword, this.max, ctx);
        if (excludingValues.length > 0) {
          if (this.valueField !== '') {
            response = response.filter(obj => !excludingValues.find(item =>  (obj as any)[this.valueField] === item));
          } else {
            response = response.filter(obj => !excludingValues.find(item => obj === item));
          }
        }
        previousSuggestion.previousKeyWord = keyword;
        previousSuggestion.result = response;
        return { response, previousSuggestion };
      }
    }
  }