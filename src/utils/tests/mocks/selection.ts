const selections = [
  {
    text: `
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed iaculis hendrerit ultricies. Nulla facilisi. Fusce condimentum feugiat libero, sit amet tempus tortor facilisis vel. Curabitur sed leo ut quam gravida varius vel id ex.
Integer eget magna a ex aliquet facilisis. In hac habitasse platea dictumst. Phasellus ut consectetur velit. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Sed ut mi a nisl vehicula convallis vel eu sem.
Quisque id nisi ut justo tincidunt elementum in nec orci. Nunc aliquam dui sit amet leo rhoncus, eu fermentum orci sodales. Vivamus volutpat, nunc vel finibus congue, sem arcu congue libero, sit amet convallis dui quam eget enim.
Cras auctor lectus ut libero sodales facilisis. Donec auctor auctor risus, vel tincidunt felis. Fusce ut tortor vel sem pellentesque varius. Nulla facilisi. Integer auctor justo in eros fringilla imperdiet.
Pellentesque euismod diam non ipsum scelerisque, et cursus libero condimentum. Vestibulum at mi vitae elit facilisis vestibulum. Aliquam erat volutpat. In hac habitasse platea dictumst. Ut vel purus vel justo vehicula feugiat.
    `,
    rawText: `
<article>
  <p>Lorem ipsum dolor sit amet, <strong>consectetur adipiscing elit</strong>. Sed <em>iaculis</em> hendrerit ultricies. Nulla facilisi. Fusce <span style="color: blue;">condimentum</span> feugiat libero, sit amet tempus tortor facilisis vel. Curabitur sed leo ut quam gravida varius vel id ex.</p>

  <p>Integer eget <span style="font-weight: bold;">magna</span> a ex aliquet facilisis. In hac habitasse platea dictumst. <em>Phasellus</em> ut consectetur velit. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Sed ut mi a nisl vehicula convallis vel eu sem.</p>

  <p>Quisque id nisi ut justo tincidunt <span style="text-decoration: underline;">elementum</span> in nec orci. Nunc <span style="font-style: italic;">aliquam</span> dui sit amet leo rhoncus, eu fermentum orci sodales. Vivamus volutpat, nunc vel finibus congue, sem arcu congue libero, sit amet convallis dui quam eget enim.</p>

  <p>Cras auctor lectus ut libero <span style="font-size: 18px;">sodales</span> facilisis. Donec auctor auctor risus, vel tincidunt felis. Fusce ut tortor vel sem pellentesque varius. Nulla facilisi. Integer auctor justo in eros fringilla imperdiet.</p>

  <p>Pellentesque euismod diam non ipsum <span style="color: green;">scelerisque</span>, et cursus libero condimentum. Vestibulum at mi vitae elit facilisis vestibulum. Aliquam erat volutpat. In hac habitasse platea dictumst. Ut vel purus vel justo vehicula feugiat.</p>
</article>
`,
  },
];

export { selections };
