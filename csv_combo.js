const yargs = require('yargs')
const fs = require('fs')
const fastCSV = require('fast-csv')
const path = require('path')

const inputFilePaths = yargs.argv._
const newCSVFileNameIndex = inputFilePaths.findIndex(f => f === '#') + 1
const newCSVFileName = newCSVFileNameIndex ? inputFilePaths.splice(newCSVFileNameIndex - 1, 2)[1] : 'combined_files'
const validatedNewCSVFileName = newCSVFileName.endsWith('.csv') ? newCSVFileName : `${newCSVFileName}.csv`

const csvCombo = {
    readCSVFile: (file) => {
        const fileExt = file.substring(file.lastIndexOf('.'))
        return new Promise((resolve, reject) => {
            if (fileExt === '.csv') {
                const readData = []
                fastCSV
                    .parseFile(file, {headers: true, quote: "'"})
                    .on('data', (data) => {
                        data['Filename'] = path.parse(file).base
                        readData.push(data)
                    })
                    .on('end', () => {
                        resolve(readData)
                    })
            } else {
                console.log(`${file} is not a CSV. Only CSV files allowed. Please try again.`)
            }
        })
    },
    mergeFiles: async (files, combinedFile) => {
        if (files.length) {
            const promises = files.map(async (file) => await csvCombo.readCSVFile(file))
            const results = await Promise.all(promises)
            const formatCsv = fastCSV.format({headers: true, quote: null})
            const writedata = fs.createWriteStream(combinedFile)
            writedata.on('finish', () => {
                console.log(`Successfully combined files to ${validatedNewCSVFileName}!`)
            })
            formatCsv.pipe(writedata)
            results.forEach((result) => {
                result.forEach((data) => {
                    formatCsv.write(data)
                })
            })
            formatCsv.end()
        } else {
            console.log('No files to merge, please enter the paths to merge the files')
            return files
        }
    },
}

csvCombo.mergeFiles(inputFilePaths, validatedNewCSVFileName)

module.exports = {
    readCSVFile: csvCombo.readCSVFile,
    mergeFiles: csvCombo.mergeFiles
}
