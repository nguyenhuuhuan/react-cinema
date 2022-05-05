export interface PreviousSuggestion<T> {
  previousKeyWord: string;
  result: T[];
}

export interface Suggestion<T> {
  response: T[];
  previous: PreviousSuggestion<T>;
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
      keyword.length > 1 && keyword.startsWith(previous.previousKeyWord) &&
      previous.result.length < this.max
    ) {
      let response;
      keyword = keyword.toUpperCase();
      if (this.displayField !== '') {
        response = previous.result.filter(item => (item as any)[this.displayField].toUpperCase().includes(keyword));
      } else {
        response = previous.result.filter(item => String(item).toUpperCase().includes(keyword));
      }
      return Promise.resolve({ response, previous });
    } else {
      return this.loadData(keyword, this.max).then(response => {
        if (excludingValues &&excludingValues.length > 0) {
          if (this.valueField !== '') {
            response = response.filter(obj => !excludingValues.find(item => (obj as any)[this.valueField] === item));
          } else {
            response = response.filter(obj => !excludingValues.find(item => obj === item));
          }
        }
        previous.previousKeyWord = keyword;
        previous.result = response;
        return { response, previous };
      })
    }
  }
}
