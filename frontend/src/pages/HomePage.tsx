import {
  Navbar,
  Hero,
  Categories,
  FeaturedCourses,
  TopInstructors,
  Benefits,
  Testimonials,
  CTA,
  Footer,
} from "../components/home";

export function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Categories />
      <FeaturedCourses />
      <TopInstructors />
      <Benefits />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  );
}
