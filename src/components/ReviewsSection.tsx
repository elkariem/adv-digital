import { listReviews } from "@/lib/db";
import { t, type Locale } from "@/lib/i18n";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";
import { Reviews, type Review } from "./Reviews";

export async function ReviewsSection({ locale }: { locale: Locale }) {
  const rows = await listReviews();
  const reviews: Review[] = rows.map((row) => ({
    id: row.id,
    doctorName: row.doctorName,
    clinicName: row.clinicName,
    text: row.text,
    createdAt: row.createdAt,
  }));

  return (
    <section id="reviews" className="bg-ivory py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-10">
        <Reveal>
          <SectionHeading
            locale={locale}
            eyebrow={t.reviews.eyebrow}
            title={t.reviews.title}
            intro={t.reviews.intro}
          />
        </Reveal>

        <Reveal delay={120} className="mt-14">
          <Reviews locale={locale} initialReviews={reviews} />
        </Reveal>
      </div>
    </section>
  );
}