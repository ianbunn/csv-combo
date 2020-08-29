const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const expect = chai.expect
const { mergeFiles, readCSVFile } = require('../csv_combo')

chai.use(chaiAsPromised)
chai.use(require('chai-fs'))

const testFileOnePath = './test/accessories.csv'
const testFileTwoPath = './test/clothing.csv'
const combinedFilePath = './combined_files.csv'

describe('Generate combined CSV file with the rows of other CSV files', () => {
    it('Merged CSV file is not empty', async () => {
        const names = [testFileOnePath, testFileTwoPath]
        await mergeFiles(names, combinedFilePath)
        await readCSVFile(combinedFilePath)
        expect(combinedFilePath).to.be.a.file('not empty').and.not.empty
    })
    it('Length of the combined file is equal to aggregated rows of the other CSV files', async () => {
        const accessories = await readCSVFile(testFileOnePath)
        const clothing = await readCSVFile(testFileTwoPath)
        const merged = await readCSVFile(combinedFilePath)
        expect(merged.length).to.be.eq(accessories.length + clothing.length)
    })
    it('Stop execution if no files available to combine', async () => {
        const filePaths = []
        const checkFiles = await mergeFiles(filePaths)
        expect(checkFiles).to.be.eq(filePaths)
    })
})