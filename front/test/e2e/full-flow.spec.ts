// test/e2e/full-flow.spec.ts
import { test, expect, APIRequestContext } from '@playwright/test';
import ProfileMock from '../fixtures/profile.json';
import TrajectoryMock from '../fixtures/trajectory.json';
import AssignmentsMock from '../fixtures/assignments.json';
import CertificationsMock from '../fixtures/certifications.json';
import RecommendationsMock from '../fixtures/recommendations.json';
import AnalyticsMock from '../fixtures/analytics.json';

const PASSWORD = process.env.PASSWORD!;
const EMPLOYEE_EMAIL = process.env.EMPLOYEE_EMAIL!;
const MANAGER_EMAIL = process.env.MANAGER_EMAIL!;
const ADMIN_EMAIL    = process.env.ADMIN_EMAIL!;

test.describe('E2E Full Dashboard Flow', () => {
  // Antes de cada test arrancamos con el servidor
  test.use({ storageState: undefined /* no queremos reutilizar login */ });

  for (const user of [
    { role: 'Empleado', email: EMPLOYEE_EMAIL, dashboardRoute: '/dashboard' },
    { role: 'Manager',  email: MANAGER_EMAIL,  dashboardRoute: '/dashboard' },
    { role: 'Administrador', email: ADMIN_EMAIL, dashboardRoute: '/usuarios' },
  ]) {
    test(`Flujo completo para ${user.role}`, async ({ page }) => {
      // 1) Stub de todas las llamadas internas del dashboard
      await page.route('**/api/profile*',       route => route.fulfill({ json: ProfileMock }));
      await page.route('**/api/trajectory*',    route => route.fulfill({ json: TrajectoryMock }));
      await page.route('**/api/assignments*',   route => route.fulfill({ json: AssignmentsMock }));
      await page.route('**/api/certifications*',route => route.fulfill({ json: CertificationsMock }));
      await page.route('**/api/recommendations*',route => route.fulfill({ json: RecommendationsMock }));
      await page.route('**/api/analytics*',     route => route.fulfill({ json: AnalyticsMock }));

      // 2) Login
      await page.goto('/login');
      await page.getByLabel('Correo electrónico').fill(user.email);
      await page.getByLabel('Contraseña').fill(PASSWORD);
      await Promise.all([
        page.waitForURL(new RegExp(`${user.dashboardRoute}$`), { waitUntil: 'networkidle' }),
        page.getByRole('button', { name: /iniciar sesión/i }).click(),
      ]);

      // 3) Verificar que el token JWT está guardado en localStorage
      const token = await page.evaluate(() => localStorage.getItem('token'));
      expect(token).toBeTruthy();

      // 4) Verificar secciones del dashboard:
      //   4.a) Perfil
      await expect(page.getByRole('heading', { name: /perfil personal/i })).toBeVisible();
      await expect(page.getByText(ProfileMock.name)).toBeVisible();
      await expect(page.getByText(ProfileMock.email)).toBeVisible();

      //   4.b) Trayectoria
      await expect(page.getByRole('heading', { name: /trayectoria profesional/i })).toBeVisible();
      for (const entry of TrajectoryMock) {
        await expect(page.getByText(entry.company)).toBeVisible();
      }

      //   4.c) Asignaciones
      await expect(page.getByRole('heading', { name: /asignaciones actuales/i })).toBeVisible();
      for (const assign of AssignmentsMock) {
        await expect(page.getByText(assign.project)).toBeVisible();
      }

      //   4.d) Certificaciones
      await expect(page.getByRole('heading', { name: /certificaciones/i })).toBeVisible();
      for (const cert of CertificationsMock) {
        await expect(page.getByText(cert.title)).toBeVisible();
      }

      //   4.e) Recomendaciones (IA)
      await expect(page.getByRole('heading', { name: /recomendaciones de asignación/i })).toBeVisible();
      for (const rec of RecommendationsMock) {
        await expect(page.getByText(rec.project)).toBeVisible();
      }

      //   4.f) Analítica / KPIs
      await expect(page.getByRole('heading', { name: /analítica/i })).toBeVisible();
      await expect(page.getByText(AnalyticsMock.totalEmployees.toString())).toBeVisible();
    });
  }

  test('Token inválido redirige a /login', async ({ page }) => {
    // Forzamos que el token sea inválido
    await page.addInitScript(() => localStorage.setItem('token', 'malformed'));
    await page.goto('/dashboard');
    // Debe volver a login
    await expect(page).toHaveURL(/\/login$/);
  });
});
