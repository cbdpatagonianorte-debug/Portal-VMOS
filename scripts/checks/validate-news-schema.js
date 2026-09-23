#!/usr/bin/env node
import { promises as fs } from 'fs';
import path from 'path';

const DIRECTORY = path.join(process.cwd(), 'src', 'content', 'noticias');

async function checkFile(filePath) {
  const content = await fs.readFile(filePath, 'utf-8');
  const frontmatterEnd = content.indexOf('---\n', 3);
  if (frontmatterEnd === -1) return true;
  const frontmatter = content.substring(3, frontmatterEnd);
  const body = content.substring(frontmatterEnd + 4);

  // Check for terminal/screenshot/console/stdout patterns in image references
  const terminalPatterns = [
    /!\[.*\]\(.*\bterminal\b.*\)/i,
    /!\[.*\]\(.*\bconsole\b.*\)/i,
    /!\[.*\]\(.*\bscreenshot\b.*\)/i,
    /!\[.*\]\(.*\bstdout\b.*\)/i,
  ];

  for (const pattern of terminalPatterns) {
    if (pattern.test(body)) {
      console.error(`[${filePath}] ERROR: Se detectó referencia a captura de terminal/consola/screenshot/stdout en el cuerpo de la nota.`);
      console.error(`[${filePath}] Reemplazar por tabla HTML, KPI Card o gráfico vectorial según skill article-visual-rendering.`);
      return false;
    }
  }

  // Check for PDF download button patterns - ensure isReport and pdfUrl are consistent
  const hasIsReport = frontmatter.includes('isReport:');
  const hasPdfUrl = frontmatter.includes('pdfUrl:');

  if (hasIsReport && !hasPdfUrl) {
    console.error(`[${filePath}] ADVERTENCIA: isReport=true pero falta pdfUrl en el frontmatter.`);
  }

  if (!hasIsReport && hasPdfUrl) {
    console.error(`[${filePath}] ADVERTENCIA: pdfUrl presente pero isReport no está en el frontmatter.`);
  }

  // Basic structure validation - accept either image or coverImage
  const imageFields = ['image', 'coverImage'];
  let hasImageField = false;
  for (const field of imageFields) {
    const fieldPattern = new RegExp(`^${field}:`, 'm');
    if (fieldPattern.test(frontmatter)) {
      hasImageField = true;
      break;
    }
  }
  if (!hasImageField) {
    console.error(`[${filePath}] ERROR FATA: Falta el campo requerido "image" o "coverImage" en el frontmatter.`);
  }

  return true;
}

async function main() {
  const files = await fs.readdir(DIRECTORY);
  const mdFiles = files.filter(f => f.endsWith('.md'));
  let hasErrors = false;

  for (const file of mdFiles) {
    const filePath = path.join(DIRECTORY, file);
    const result = await checkFile(filePath);
    if (!result) hasErrors = true;
  }

  if (hasErrors) {
    process.exit(1);
  }
  process.exit(0);
}

main().catch(err => {
  console.error('Error executing validation:', err);
  process.exit(1);
});