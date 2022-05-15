import { ValueText } from 'onecore';

export interface MasterDataService {
  getStatus(): Promise<ValueText[]>;
}
export class MasterDataClient implements MasterDataService {
  private status = [
    { value: 'A', text: 'Active' },
    { value: 'I', text: 'Inactive' }
  ];
  getStatus(): Promise<ValueText[]> {
    return Promise.resolve(this.status);
  }
}
