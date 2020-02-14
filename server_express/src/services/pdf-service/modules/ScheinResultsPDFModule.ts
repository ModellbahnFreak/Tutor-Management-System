import { PDFWithStudentsModule } from './PDFWithStudentsModule';
import { StudentDocument } from '../../../model/documents/StudentDocument';
import { ScheincriteriaSummaryByStudents } from 'shared/dist/model/ScheinCriteria';

interface GeneratorOptions {
  students: StudentDocument[];
  summaries: ScheincriteriaSummaryByStudents;
  enableShortMatriculatinNo: boolean;
}

export class ScheinResultsPDFModule extends PDFWithStudentsModule<GeneratorOptions> {
  constructor() {
    super('scheinstatus.html');
  }

  /**
   * Generates a PDF which shows a list of all students and their schein status.
   *
   * @param options Must contain all students which schein status should be added to the list. Furthermore it needs to contain the scheincriteria summaries for at least all of those students.
   *
   * @returns Buffer of a PDF containing the list with the schein status of all the given students.
   */
  public generatePDF({
    students: givenStudents,
    summaries,
    enableShortMatriculatinNo,
  }: GeneratorOptions): Promise<Buffer> {
    const students = givenStudents.filter(student => !!student.matriculationNo);
    const shortenedMatriculationNumbers = this.getShortenedMatriculationNumbers(students);

    const tableRows: string[] = [];

    shortenedMatriculationNumbers.forEach(({ studentId, shortenedNo }) => {
      const passedString = summaries[studentId].passed ? '{{yes}}' : '{{no}}';

      if (enableShortMatriculatinNo) {
        tableRows.push(`<tr><td>${shortenedNo}</td><td>${passedString}</td></tr>`);
      } else {
        const student = students.find(s => s.id === studentId);
        tableRows.push(
          `<tr><td>${student?.matriculationNo} (${shortenedNo})</td><td>${passedString}</td></tr>`
        );
      }
    });

    const body = this.replacePlaceholdersInTemplate(tableRows);
    return this.generatePDFFromBody(body);
  }

  /**
   * Replaces the placeholder in the HTML template by the actual table rows. The rows get put into the spot of the `{{statuses, [yes, no]}}` placeholder.
   *
   * @param tableRows Rows to place into `{{statuses}}`.
   *
   * @returns The prepared template with filled in information.
   */
  private replacePlaceholdersInTemplate(tableRows: string[]): string {
    const template = this.getTemplate();

    return template.replace(/{{statuses.*}}/g, substring => {
      const wordArray = substring.match(/(\[(\w|\s)*,(\w|\s)*\])/g);
      const replacements = { yes: 'yes', no: 'no' };

      if (wordArray && wordArray[0]) {
        const [yes, no] = wordArray[0]
          .replace(/\[|\]|/g, '')
          .replace(/,\s*/g, ',')
          .split(',');

        replacements.yes = yes || replacements.yes;
        replacements.no = no || replacements.no;
      }

      return tableRows
        .join('')
        .replace(/{{yes}}/g, replacements.yes)
        .replace(/{{no}}/g, replacements.no);
    });
  }
}