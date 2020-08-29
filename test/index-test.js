const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const expect = chai.expect
const { mergeFiles, readCSVFile } = require('../csv_combo')

chai.use(chaiAsPromised)
chai.use(require('chai-fs'))

describe('Generate combined CSV file with the rows of other CSV files', () => {
    it('Merged CSV file is not empty', async () => {
        const names = ['./test/accessories.csv', './test/clothing.csv']
        await mergeFiles(names, './combined_files.csv')
        await readCSVFile('./combined_files.csv')
        expect('./combined_files.csv').to.be.a.file('not empty').and.not.empty
    })
    it('Length of the combined file is equal to aggregated rows of the other CSV files', async () => {
        const accessories = await readCSVFile('./test/accessories.csv')
        const clothing = await readCSVFile('./test/clothing.csv')
        const merged = await readCSVFile('./combined_files.csv')
        expect(merged.length).to.be.eq(accessories.length + clothing.length)
    })
    it('Stop execution if no files available to combine', async () => {
        const filePaths = []
        const checkFiles = await mergeFiles(filePaths)
        expect(checkFiles).to.be.eq(filePaths)
    })
})