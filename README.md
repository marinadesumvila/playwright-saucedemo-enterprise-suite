# SauceDemo enterprise suite

Suite end-to-end de [SauceDemo](https://www.saucedemo.com/) con Playwright y TypeScript. Los títulos de cada `test()` llevan la clave de Xray (`C-AUTH-01`, `C-PLP-01`, …) importada desde el repositorio de pruebas.

## Ejecución

```bash
npm ci
npx playwright install
npm test
npm run test:chromium
npm run report
```

`baseURL` está definida en `playwright.config.ts`. Los specs viven en `tests/e2e/` y reciben los Page Objects desde `src/fixtures/test.fixture.ts`.

## Capas

| Capa | Ruta | Responsabilidad |
| --- | --- | --- |
| Components | `src/components/` | Header, menú lateral, footer y acceso al carrito |
| Pages | `src/pages/` | Login, catálogo, detalle, carrito y checkout |
| Fixtures | `src/fixtures/test.fixture.ts` | Inyección de los Page Objects |
| Data | `src/data/` | Usuarios, productos y datos de checkout |
| Types | `src/types/` | Contratos de usuario, producto y pedido |
| Utils | `src/utils/apiHelpers.ts` | Sesión del navegador y parseo de importes |

## Módulos y claves Xray

| Spec | Carpeta Xray | Claves |
| --- | --- | --- |
| `tests/e2e/auth.spec.ts` | SauceDemo/01_AUTH | C-AUTH-01 … C-AUTH-05 |
| `tests/e2e/plp.spec.ts` | SauceDemo/02_PLP | C-PLP-01 … C-PLP-05 |
| `tests/e2e/pdp.spec.ts` | SauceDemo/03_PDP | C-PDP-01 … C-PDP-04 |
| `tests/e2e/cart.spec.ts` | SauceDemo/04_CART | C-CART-01 … C-CART-05 |
| `tests/e2e/checkout.spec.ts` | SauceDemo/05_CHK | C-CHK-01 … C-CHK-05 |
| `tests/e2e/account.spec.ts` | SauceDemo/06_ACCT | C-ACCT-01 … C-ACCT-03 |
