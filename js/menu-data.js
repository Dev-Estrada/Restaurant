/**
 * Carta del restaurante - El Pasaje
 * Estructura escalable: añade categorías o platos aquí.
 * Para cambiar imágenes: actualiza la propiedad "image" de cada categoría.
 */
const RESTAURANT_MENU = {
  food: [
    {
      id: 'entrantes',
      name: 'Entrantes',
      image: 'https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg?auto=compress&cs=tinysrgb&w=800',
      items: [
        { name: 'Croquetas Artesanas', price: '7.50', description: '6 Unidades a elegir Jamón Ibérico, Chipirones o Pulpo' },
        { name: 'Gajos de Patatas Bravas o Braviolis', price: '7.20', description: 'Salsas Caseras' },
        { name: 'Chorizo a la Sidra', price: '7.80', description: 'Clásica receta con chorizo extra de León' },
        { name: 'Tortos de Maíz Asturianos', price: '10.50', description: 'Picadillo, huevo, jamón salteado y queso curado de oveja con membrillo de manzana' },
        { name: 'Solomillos de Pollo Crujientes', price: '9.50', description: 'Tiras de pollo crujientes apanados con panko japonés' },
        { name: 'Calamares Fritos a la Romana', price: '13.50', description: 'Anillas de pota rebozado acompañado con lima y alioli suave' },
        { name: 'Berenjenas a la Cordobesa con Miel', price: '8.50', description: 'Receta centenaria de la Abuela con miel de flores y miel de caña' },
        { name: 'Ensaladilla Rusa Tradicional', price: '8.10', description: 'Pan picos, pimiento piquillo y gambas babys crujiente' },
        { name: 'Gambones a la Parrilla', price: '12.70', description: '7 unidades de Gambones L1 en Aove de ajo' },
        { name: 'Parrillada de Verduras', price: '8.90', description: 'Cortes de verduras tiernas y frescas' },
        { name: 'Nachos Mexicanos', price: '12.90', description: 'Carne picada, queso cheddar, pico de gallo, crema agria, guacamole y alubias' },
        { name: 'Nachos Mexicanos Veganos', price: '15.50', description: 'Carne picada vegana, cheddar vegano, pico de gallo, guacamole y alubias' },
        { name: 'Gyozas (6 Unidades)', price: '8.50', description: 'Pato, verduras o pollo' },
        { name: 'Bocartes con Jamón', price: '12.00', description: 'Bocartes crujientes con jamón serrano frito' }
      ]
    },
    {
      id: 'tablas',
      name: 'Tablas',
      image: 'https://images.pexels.com/photos/5949901/pexels-photo-5949901.jpeg?auto=compress&cs=tinysrgb&w=800',
      items: [
        { name: 'Tabla de Quesos Asturianos', price: '14.00', description: 'Cabrales, Gamonéu y Afuega\'l Pitu con membrillo y nueces' },
        { name: 'Tabla de Ibéricos', price: '15.50', description: 'Jamón, Lomo, Chorizo y Queso curado' }
      ]
    },
    {
      id: 'carnes',
      name: 'Carnes',
      image: 'https://images.pexels.com/photos/262959/pexels-photo-262959.jpeg?auto=compress&cs=tinysrgb&w=800',
      items: [
        { name: 'Entrecot a la Parrilla', price: '22.00', description: '500g de carne asturiana con pimientos de Padrón' },
        { name: 'Solomillo de Ternera', price: '23.00', description: 'Con reducción de sidra y puré de manzana' }
      ]
    },
    {
      id: 'cachopo',
      name: 'Cachopo',
      image: 'https://images.pexels.com/photos/5409015/pexels-photo-5409015.jpeg?auto=compress&cs=tinysrgb&w=800',
      items: [
        { name: 'Cachopo Tradicional', price: '18.00', description: 'Ternera rellena de jamón y queso, con patatas caseras' },
        { name: 'Cachopo de Cabrales', price: '19.50', description: 'Relleno de cecina, setas y queso de cabrales' }
      ]
    },
    {
      id: 'tostas',
      name: 'Tostas',
      image: './img/Tostas.jpg',
      items: [
        { name: 'Tosta Jamón Ibérico', price: '8.90', description: 'Jamón ibérico, tumaca y AOVE' },
        { name: 'Tosta de Salmon Humado', price: '9.60', description: 'Queso crema, Salmón ahumado y rúcula' },
        { name: 'Tosta Caprese', price: '8.60', description: 'Tomate, queso mozzarella, Pulpa de aguacate, canónigos y pesto fresco' },
        { name: 'Tosta de Solomillo Ibérico', price: '9.50', description: 'Medallones de solomillo ibérico, rulo de queso de cabra, cebolla caramelizada y Rúcula' },
        { name: 'Tosta de Gulas y Gambas', price: '9.80', description: 'Gulas y gambas salteadas en AOVE de ajo y perejil con Ali-Oli Suave' },
        { name: 'Tosta de Verduras', price: '8.80', description: 'Pulpa de aguacate, berenjena, calabacín, pimiento rojo y verde, espárragos y tomate' }
      ]
    },
    {
      id: 'pulpos',
      name: 'Pulpos',
      image: './img/Pulpos.jpg',
      items: [
        { name: 'Pata de Pulpo', price: '22.80', description: 'Pata de pulpo al grill, acompañado de parmentier de patatas' },
        { name: 'Pulpin al Grill', price: '23.90', description: 'Pulpin al grill con toque de pimentón dulce o picante acompañado de patatinas' }
      ]
    },
    {
      id: 'ensaladas',
      name: 'Ensaladas',
      image: './img/Ensaladas.jpg',
      items: [
        { name: 'Ensalada de Burrata', price: '11.80', description: 'Rúcula, tomate, frutos del bosque, salsa pesto y tomate seco' },
        { name: 'Ensalada César', price: '10.90', description: 'Mezcla de lechuga con trozos de pollo crujientes, escamas de queso parmesano, crotones de pan y Salsa César' },
        { name: 'Ensalada El Pasaje', price: '11.90', description: 'Mezclum fresco, Brotes, tomates cherry, aguacate, queso fresco, Gambones salvajes a la plancha, aderezo especial de la casa' }
      ]
    },
    {
      id: 'huevos',
      name: 'Huevos Rotos',
      image: './img/Huevos.jpg',
      items: [
        { name: 'Huevos Rotos con Jamón Ibérico', price: '9.00' },
        { name: 'Huevos Rotos Solomillo Ibérico', price: '9.50' },
        { name: 'Huevos Rotos Morcilla de León', price: '8.90' },
        { name: 'Huevos Rotos con Gulas y Gambas', price: '9.80' },
        { name: 'Huevos Rotos con Salmon Ahumado', price: '9.60' }
      ]
    },
    {
      id: 'hamburguesa',
      name: 'Hamburguesas',
      image: './img/Hamburguesa.jpg',
      items: [
        { name: 'Hamburguesa Angus', price: '12.00', description: 'Pan Brioche, 200g de carne Angus, rulo de cabra, bacón, cebolla confitada, lechuga, tomate y patatas fritas' },
        { name: 'Hamburguesa Wagyu', price: '15.00', description: 'Pan Brioche, 150g de carne Wagyu doble pata negra, bacón, queso Gamonéu, Cebolla roja encurtida, Lechuga, tomate y patatas fritas' },
        { name: 'Hamburguesa de Pollo', price: '10.00', description: 'Milanesa de pollo crujiente, queso cheddar, pimiento confitado, bacón, lechuga, tomate y patatas fritas' },
        { name: 'Hamburguesa Ahumada', price: '12.50', description: 'Pan Brioche, Doble Burger Rizada de Vacuno Premium, cheddar, bacón, pepinillos, lechuga, tomate y patatas fritas' },
        { name: 'Hamburguesa Vegana', price: '10.50', description: 'Pan Brioche, pimientos asados, queso 100% vegano, burguer vegana, lechuga, tomate y patatas fritas' },
        { name: 'Hamburguesa Big-Veggle', price: '13.50', description: 'Pan Brioche, Doble veggle Burger, setas en tempura, Cheddar Vegano, Cebolla caramelizada, lechuga, tomate y patatas fritas' }
      ]
    }
  ],
  drinks: [
    { id: 'ginebra', name: 'Ginebra', image: './img/Ginebra.jpg', items: [
      { name: 'Beefeater', price: '4.50' }, { name: 'Rives', price: '4.50' }, { name: 'Tanqueray', price: '5.00' },
      { name: "Seagram's", price: '5.00' }, { name: 'Puerto Indias', price: '5.50' }, { name: 'Aperol Sprite', price: '5.50' }
    ]},
    { id: 'vermuth', name: 'Vermuth', image: './img/Vermuth.jpg', items: [
      { name: 'Yzaguirre Rojo', price: '2.60' }, { name: 'Yzaguirre Blanco', price: '2.60' }, { name: 'Yzaguirre Reserva', price: '3.00' },
      { name: 'Martini Blanco', price: '2.30' }, { name: 'Martini Rosso', price: '2.30' }
    ]},
    { id: 'vodka', name: 'Vodka', image: './img/Vodka.jpg', items: [
      { name: 'Absolut', price: '4.80' }, { name: 'Eristoff', price: '4.80' }, { name: 'Smirnoff', price: '4.80' }
    ]},
    { id: 'chupitos', name: 'Chupitos', image: './img/Chupitos.jpg', items: [
      { name: 'Black Label', price: '4.00' }, { name: "Jack Daniel's", price: '4.00' }, { name: 'Legendario', price: '3.50' },
      { name: 'Brugal', price: '2.80' }, { name: 'Jägermeister', price: '4.00' }, { name: 'Tequila José Cuervo', price: '4.00' }, { name: 'Baileys', price: '4.00' }
    ]},
    { id: 'cocteles', name: 'Cócteles', image: './img/Cocteles.jpg', items: [
      { name: 'Mojito', price: '6.00' }, { name: 'Bloody Mary', price: '7.00' }, { name: 'Caipirinha', price: '6.50' },
      { name: 'Daiquiri', price: '6.00' }, { name: 'Margarita', price: '7.00' }, { name: 'Moscow Mule', price: '8.00' }, { name: 'Piña Colada', price: '7.00' }
    ]},
    { id: 'whisky', name: 'Whisky', image: './img/Whisky.jpg', items: [
      { name: 'Red Label', price: '4.80' }, { name: 'Black Label', price: '6.00' }, { name: 'White Label', price: '4.80' },
      { name: 'DyC', price: '4.00' }, { name: 'Ballantines', price: '4.80' }, { name: "Jack Daniel's", price: '6.80' }, { name: 'JB', price: '4.80' }
    ]},
    { id: 'ron', name: 'Ron', image: './img/Ron.jpg', items: [
      { name: 'Bacardi', price: '4.50' }, { name: 'Legendario', price: '6.80' }, { name: 'Brugal', price: '4.80' },
      { name: 'Cacique', price: '4.80' }, { name: 'Barcelo', price: '4.80' }, { name: 'Arehucas', price: '4.50' }, { name: 'Habana 7', price: '6.00' }, { name: 'Habana 3', price: '4.00' }
    ]}
  ]
};

if (typeof window !== 'undefined') { window.RESTAURANT_MENU = RESTAURANT_MENU; }
