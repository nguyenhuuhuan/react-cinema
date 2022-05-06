export interface PreviousSuggestion<T> {
  keyword: string;
  list: T[];
}

export interface Suggestion<T> {
  list: T[];
  last: PreviousSuggestion<T>;
}

export class SuggestionService<T> {
  constructor(
    protected loadData: (keyword: string, max: number, ctx?: any) => Promise<T[]>,
    private max: number,
    private displayField: string = '',
    private valueField: string = '') {
    this.getSuggestion = this.getSuggestion.bind(this);
  }

  getSuggestion(keyword: string, previous: PreviousSuggestion<T>, excludingValues?: T[]): Promise<Suggestion<T>> {
    
    if (
      keyword.length > 1 && keyword.startsWith(previous.keyword) &&
      previous.list.length < this.max
    ) {
      let response;
      keyword = keyword.toUpperCase();
      if (this.displayField !== '') {
        response = previous.list.filter(item => (item as any)[this.displayField].toUpperCase().includes(keyword));
      } else {
        response = previous.list.filter(item => String(item).toUpperCase().includes(keyword));
      }
      return Promise.resolve({ list:response, last:previous });
    } else {
      return this.loadData(keyword, this.max).then(response => {
        if (excludingValues &&excludingValues.length > 0) {
          if (this.valueField !== '') {
            response = response.filter(obj => !excludingValues.find(item => (obj as any)[this.valueField] === item));
          } else {
            response = response.filter(obj => !excludingValues.find(item => obj === item));
          }
        }
        previous.keyword = keyword;
        previous.list = response;
        return { list:response, last:previous };
      })
    }
  }
}
