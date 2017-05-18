import DownloadHelper from '../../app/js/helpers/downloadHelper';
import { expect } from 'chai';
const testData = [
  {
    name: 'Test User',
    age: '23',
    gender: 'M'
  },
  {
    name: 'Test User 2',
    age: '24',
    gender: 'f'
  },
]

const testDataCSVFormat = '"Test User","23","M"\n"Test User 2","24","f"'

describe('DownloadHelper ', () => {
  it('#dowloadCSV() should throw an error if empty data is passed', () => {
    expect(() => DownloadHelper.downloadCSV([])).to.throw();
  });

  it('#dowloadCSV() should throw an error if no data is passed', () => {
    expect(() => DownloadHelper.downloadCSV()).to.throw();
  });

  it('#formatToCSV() should not throw an error if no header data is passed',
  () => {
    expect(DownloadHelper.formatToCSV(testData)).to.equal(testDataCSVFormat);
  });
});