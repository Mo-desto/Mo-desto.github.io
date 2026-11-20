const PROJECTS = new Set([
  "Landing Page",
  "E-commerce",
  "Sistema de Turnos",
  "Web a medida"
]);

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const body = await request.json();
    const name = String(body.name || "").replace(/[\r\n]+/g, " ").trim();
    const email = String(body.email || "").replace(/[\r\n]+/g, "").trim();
    const message = String(body.message || "").trim();
    const projectType = String(body.projectType || "").trim();

    if (!name || !email || !message) {
      return Response.json(
        { success: false, error: "Faltan datos" },
        { status: 400 }
      );
    }

    if (name.length > 80 || email.length > 120 || message.length > 4000) {
      return Response.json(
        { success: false, error: "Datos demasiado largos" },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json(
        { success: false, error: "Email inválido" },
        { status: 400 }
      );
    }

    if (projectType && !PROJECTS.has(projectType)) {
      return Response.json(
        { success: false, error: "Tipo de proyecto inválido" },
        { status: 400 }
      );
    }

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeMessage = escapeHtml(message).replace(/\n/g, "<br>");
    const safeProject = escapeHtml(projectType || "Sin especificar");

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "Modest Portfolio <onboarding@resend.dev>",
        to: ["modestw.com@gmail.com"],
        reply_to: email,
        subject: `Consulta · ${projectType || "Web"} — ${name}`.slice(0, 180),
        html: `
          <h2>Nueva consulta desde modest.com.ar</h2>
          <p><strong>Nombre:</strong> ${safeName}</p>
          <p><strong>Email:</strong> ${safeEmail}</p>
          <p><strong>Proyecto:</strong> ${safeProject}</p>
          <p><strong>Mensaje:</strong></p>
          <p>${safeMessage}</p>
        `
      })
    });

    if (!response.ok) {
      return Response.json(
        { success: false, error: "No se pudo enviar el email" },
        { status: 500 }
      );
    }

    return Response.json({ success: true });
  } catch (error) {
    return Response.json(
      { success: false, error: "Error interno" },
      { status: 500 }
    );
  }
}
