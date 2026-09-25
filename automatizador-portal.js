import { chromium } from 'playwright';

(async () => {
  // Iniciamos el navegador en modo visible (headed) para que puedas ver la ejecución
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log('Navegando al portal de noticias en http://localhost:4321/...');
    await page.goto('http://localhost:4321/', { waitUntil: 'networkidle' });

    console.log('Verificando elementos de la interfaz...');
    
    // Validar presencia de la cabecera del portal (header sticky con clase w-full bg-surface)
    const header = page.locator('header.w-full');
    await header.waitFor({ state: 'visible', timeout: 5000 });
    console.log('✓ Cabecera encontrada correctamente.');

    // Validar widgets o elementos interactivos de tu portal
    // Usamos el main del layout principal como referencia
    const widget = page.locator('main');
    await widget.first().waitFor({ state: 'visible', timeout: 5000 });
    console.log('✓ Elementos interactivos del DOM validados con éxito.');

  } catch (error) {
    console.error('❌ Error durante la automatización:', error);
  } finally {
    await browser.close();
  }
})();