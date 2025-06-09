// test/e2e/login.spec.ts
import { test, expect } from '@playwright/test';

// Recoge la contraseña común desde .env.test
const PASSWORD = process.env.PASSWORD!;

test.describe('E2E Login Flow', () => {
  const users = [
    {
      role: 'Empleado',
      email: process.env.EMPLOYEE_EMAIL!,
      expectedName: 'Juan',
      expectedRoute: '/dashboard',
    },
    {
      role: 'Manager',
      email: process.env.MANAGER_EMAIL!,
      expectedName: 'Daniel',
      expectedRoute: '/dashboard',
    },
    {
      role: 'Administrador',
      email: process.env.ADMIN_EMAIL!,
      expectedName: 'Nuria',
      expectedRoute: '/usuarios',
    },
  ];

  for (const { role, email, expectedName, expectedRoute } of users) {
    test(`login exitoso como ${role}`, async ({ page }) => {
      // 1) Navega a /login
      await page.goto('/login');

      // 2) Rellena el formulario
      await page.getByLabel('Correo electrónico').fill(email);
      await page.getByLabel('Contraseña').fill(PASSWORD);

      // 3) Haz click y espera a la ruta correcta
      await Promise.all([
        page.waitForURL(new RegExp(`${expectedRoute}$`), { waitUntil: 'load' }),
        page.click('button:has-text("Iniciar sesión")'),
      ]);

      // 4) Comprueba que la URL acabó en la ruta esperada
      await expect(page).toHaveURL(new RegExp(`${expectedRoute}$`));

      // 5) Si no es Administrador, comprueba el saludo "Bienvenido, X"
      if (role !== 'Administrador') {
        const saludo = page.getByRole('heading', {
          level: 1,
          name: new RegExp(`Bienvenido,\\s*${expectedName}`, 'i'),
        });
        await expect(saludo).toBeVisible();
      }
    });
  }

  test('login fallido con credenciales inválidas', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Correo electrónico').fill('foo@bar.com');
    await page.getByLabel('Contraseña').fill('wrongpass');
    await page.getByRole('button', { name: /iniciar sesión/i }).click();

    // Filtra solo el alert real (descarta el announcer de Next.js)
    const alertaReal = page
      .locator('role=alert')
      .filter({ hasText: /verifica tus credenciales/i });
    await expect(alertaReal).toBeVisible();
  });
});
