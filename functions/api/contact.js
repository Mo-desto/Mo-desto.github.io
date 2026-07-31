export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return Response.json(
        { success: false, error: "Faltan datos" },
        { status: 400 }
      );
    }

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
        subject: `Consulta desde portfolio - ${name}`,
        html: `
          <h2>Nueva consulta desde modest.com.ar</h2>
          <p><strong>Nombre:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Mensaje:</strong></p>
          <p>${message}</p>
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