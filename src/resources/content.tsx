import { About, Blog, Gallery, Home, Newsletter, Person, Social, Work } from "@/types";
import { Line, Row, Text, TypeFx } from "@once-ui-system/core";

const person: Person = {
  firstName: "Dune-X",
  lastName: " ",
  name: `Dune-X`,
  role: "Equipo de Raids",
  avatar: "/images/logo.png",
  email: "dunex@dune-x.com",
  location: "Europe/Madrid", // Expecting the IANA time zone identifier, e.g., 'Europe/Vienna'
  languages: [], // optional: Leave the array empty if you don't want to display languages
};

const newsletter: Newsletter = {
  display: false,
  title: <>Subscribete a la Newsletter de {person.firstName}</>,
  description: <> Mantente informado sobre nuestra aventura </>,
};

const social: Social = [
  // Links are automatically displayed.
  // Import new icons in /once-ui/icons.ts
  // Set essentials: true for links you want to show on the about page
  {
    name: "LinkedIn",
    icon: "linkedin",
    link: "https://www.linkedin.com/in/dune-x-081779376",
    essential: true,
  },
  {
    name: "Instagram",
    icon: "instagram",
    link: "https://www.instagram.com/dune_x_/",
    essential: true,
  },
  {
    name: "TikTok",
    icon: "tiktok",
    link: "https://www.tiktok.com/@dune_x_",
    essential: true,
  },
  {
    name: "Email",
    icon: "email",
    link: `mailto:${person.email}`,
    essential: true,
  },
];

const home: Home = {
  path: "/",
  image: "/images/og/home.jpg",
  label: "Home",
  title: `${person.name}`,
  description: `Página web del equipo ${person.role}`,
  headline: (
    <img 
      src="/images/logo.png" 
      alt="Dune-X Logo" 
      style={{ height: 'auto', maxWidth: '100%' }} 
    />
  ),
  featured: {
    display: false,
    title: (
      <Row gap="12" vertical="center">
        <strong className="ml-4">Once UI</strong>{" "}
        <Line background="brand-alpha-strong" vert height="20" />
        <Text marginRight="4" onBackground="brand-medium">
          Featured work
        </Text>
      </Row>
    ),
    href: "/work/building-once-ui-a-customizable-design-system",
  },
  subline: (
      <TypeFx
words="Más que un Raid, una aventura que deja huella"
speed={100}
delay={500}
trigger="instant"
/> 
  ),
};

const about: About = {
  path: "/about",
  label: "Sobre el equipo",
  title: `Sobre – ${person.name}`,
  description: `Meet ${person.name}, ${person.role}`,
  tableOfContent: {
    display: true,
    subItems: true,
  },
  avatar: {
    display: true,
  },
  calendar: {
    display: false,
    link: "https://cal.com",
  },
  intro: {
    display: true,
    title: "Introducción",
    description: (
      <Text>
        Detrás de Dune-X hay un grupo de jóvenes con una pasión compartida: la aventura, la mecánica y las ganas de marcar la diferencia. Cuatro amigos ingenieros y soñadores que hemos unido fuerzas para vivir una experiencia única y solidaria.<br /> <br />

        Cada integrante del equipo aporta algo especial: conocimientos técnicos, capacidad de organización, creatividad o pura energía para seguir adelante cuando el desierto aprieta. Nos une la voluntad de afrontar este reto con compromiso, ingenio y compañerismo.
        </Text>
    ),
  },
  work: {
    display: true, // set to false to hide this section
    title: "Los coches",
    experiences: [
      {
        company: "Seat Panda",
        timeframe: "1984",
        role: "La pandereta",
        achievements: [
          <>
            Pequeño por fuera, enorme en espíritu. El SEAT Panda es un clásico indestructible que, con su ligereza y sencillez mecánica, se convierte en un compañero ideal para afrontar caminos, polvo y aventuras sin límites.
          </>,
        ],
        images: [
          // optional: leave the array empty if you don't want to display images
          {
            src: "/images/vehicles/panda/panda_presentacion.png",
            alt: "seat_panda",
            width: 35,
            height: 25,
          },
        ],
      },
      {
        company: "Seat Marbella",
        timeframe: "1994",
        role: "La marbelleta",
        achievements: [
          <>
            El SEAT Marbella recoge la esencia del Panda y la lleva un paso más allá. Un clásico humilde pero valiente, perfecto para raids donde la resistencia, la mecánica simple y el alma aventurera lo son todo.
          </>,
        ],
        images: [
          {
            src: "/images/vehicles/marbella/marbella_presentacion.png",
            alt: "seat_marbella",
            width: 35,
            height: 25,
          },
        ],
      },
    ],
  },
  studies: {
    display: false, // set to false to hide this section
    title: "Studies",
    institutions: [
      {
        name: "University of Jakarta",
        description: <>Studied software engineering.</>,

      },
      {
        name: "Build the Future",
        description: <>Studied online marketing and personal branding.</>,
      },
    ],
  },
  technical: {
    display: true, // set to false to hide this section
    title: "Pilotos",
    skills: [
      {
        title: "Seat Panda",
        description: (
          <></>
        ),
        tags: [
        ],
        // optional: leave the array empty if you don't want to display images
       images: [
  {
    src: "/images/drivers/raul.jpg",
    alt: "Raul Rodriguez",
    width: 16,
    height: 16,
  },
  {
    src: "/images/drivers/joan.jpg",
    alt: "Joan Pons",
    width: 16,
    height: 16,
  },
],
      },
      {
        title: "Seat Marbella",
        description: (
          <></>
        ),
        tags: [
        ],
        // optional: leave the array empty if you don't want to display images
       images: [
  {
    src: "/images/drivers/pol.jpg",
    alt: "Pol Lahiguera",
    width: 16,
    height: 16,
  },
  {
    src: "/images/drivers/alex.jpg",
    alt: "Alex Parra",
    width: 16,
    height: 16,
  },
],
      },
    ],
  },
};

const blog: Blog = {
  path: "/blog",
  label: "Blog",
  title: "Sigue nuestra evolución...",
  description: `Read what ${person.name} has been up to recently`,
  // Create new blog posts by adding a new .mdx file to app/blog/posts
  // All posts will be listed on the /blog route
};

const work: Work = {
  path: "/proyectos",
  label: "Proyectos",
  title: `Projects – ${person.name}`,
  description: `Design and dev projects by ${person.name}`,
  // Create new project pages by adding a new .mdx file to app/blog/posts
  // All projects will be listed on the /home and /work routes
};

const gallery: Gallery = {
  path: "/galeria",
  label: "Galeria",
  title: `Galería de fotos – ${person.name}`,
  description: `Una colección de imágenes de ${person.name}`,
  // Images by https://lorant.one
  // These are placeholder images, replace with your own
  images: [
    {
      src: "/images/gallery/horizontal-1.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/vertical-1.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/horizontal-2.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/vertical-2.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/vertical-3.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/horizontal-3.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/horizontal-4.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/vertical-4.jpg",
      alt: "image",
      orientation: "vertical",
    },
  ],
};

export const patrocinadores = {
  label: "Sponsors",
  title: "Patrocinadores",
  description: "Marcas y personas que apoyan el proyecto Dune X.",
  path: "/patrocinadores",
};

export { person, social, newsletter, home, about, blog, work, gallery };
