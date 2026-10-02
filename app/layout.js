export const metadata = {
  title: "Ordena tu Dinero | Emprendiendo con Éxito",
  description: "Organiza ingresos, gastos, deudas y metas."
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
