import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, ChevronRight, X, Mail, Github } from "lucide-react";
import mafiaLogo from "@/assets/mafia-logo.png";
import img01 from "@/assets/gallery/01.png";
import img033 from "@/assets/gallery/033.jpg";
import imgCcb462 from "@/assets/gallery/ccb462170fbabfd1bbb2df276f666c2f.jpg";
import imgCcdemo9b from "@/assets/gallery/ccdemo9b.jpg";
import imgDarkVillage from "@/assets/gallery/dark_village_bg2.jpg";
import imgDownload from "@/assets/gallery/download.jpg";
import imgGame20141219 from "@/assets/gallery/game_2014-12-19_20-42-49-76.png";
import imgHq720 from "@/assets/gallery/hq720.jpg";
import imgHq720Alt from "@/assets/gallery/hq720-1.jpg";
import imgImages from "@/assets/gallery/images.jpg";
import imgImages1 from "@/assets/gallery/images-1.jpg";
import imgImages2 from "@/assets/gallery/images-2.jpg";
import imgJha from "@/assets/gallery/JHAa3h7bftt3IUh0CwkZ1JOlykLgj1hM5etDdjJlv_Y.webp";
import imgMaxres from "@/assets/gallery/maxresdefault.jpg";
import imgMaxres1 from "@/assets/gallery/maxresdefault-1.jpg";
import imgMwe2 from "@/assets/gallery/mwe_2.jpg";
import imgMwe21 from "@/assets/gallery/mwe_2_1.jpg";
import imgSkodaFabia from "@/assets/gallery/skoda_Fabia_combi_POLICIE.jpg";
import imgSkoda105 from "@/assets/gallery/skoda-105_GL.jpg";
import imgSrp from "@/assets/gallery/SRP8d9991_Game_2020_06_08_23_04_29_89b.jpg";
import imgU4f from "@/assets/gallery/u4fjlr9p9lv4ei2666da111a0d37130634391.jpg";

interface Signature {
  id?: string;
  name: string;
  email?: string;
  message?: string;
  date: string;
}

type Language = "en" | "cs";

const translations: Record<
  Language,
  {
    heroTitle: string;
    heroSubtitle: string;
    petitionIntro: string[];
    petitionHighlight: string;
    petitionMiddle: string[];
    signatureInvite: string;
    formTitle: string;
    form: {
      nameLabel: string;
      emailLabel: string;
      emailOptional: string;
      messageLabel: string;
      messageOptional: string;
      namePlaceholder: string;
      emailPlaceholder: string;
      messagePlaceholder: string;
      submit: string;
      submitting: string;
    };
    signaturesTitle: string;
    listLoading: string;
    listEmpty: string;
    signaturesCount: (count: number) => string;
    galleryTitle: string;
    galleryDescription: string;
    contactTitle: string;
    contactDescription: string;
    contactLinkLabel: string;
    footerText: string;
    footerContact: string;
    toasts: {
      nameRequiredTitle: string;
      nameRequiredDesc: string;
      loadErrorTitle: string;
      loadErrorDesc: string;
      thankYouTitle: string;
      thankYouDesc: string;
      submitErrorTitle: string;
      submitErrorFallback: string;
    };
  }
> = {
  en: {
    heroTitle: "Open Source Mafia: The City of Lost Heaven",
    heroSubtitle: "A Community Appeal to Hangar 13",
    petitionIntro: [
      "We are a long-standing modding community that has kept the original Mafia: The City of Lost Heaven alive ever since its release in 2002. Over the years, countless modifications, technical improvements, new car models, unofficial patches, editors and many other fan-made projects have been created purely out of enthusiasm.",
      "Thanks to this effort, the original Mafia remains playable on modern systems and continues to be discovered by new players even today. The community has maintained the game's visibility and legacy for more than two decades — without expecting anything in return.",
      "Many of the creators who helped shape the modding scene are still active, constantly updating and improving the game so that it can survive for future generations. This is why we publish this appeal:",
    ],
    petitionHighlight:
      "We respectfully ask Hangar 13 to release the original Mafia as an open-source project — including any preserved tools, editors, or resources that could help the community keep the game alive.",
    petitionMiddle: [
      "We sincerely believe this would benefit both sides. Open-sourcing the game would allow Mafia to live on, reaching new audiences and ensuring its long-term preservation. For Hangar 13, it would be a powerful gesture of goodwill — a recognition of a community that has supported the Mafia series faithfully for over 20 years. It would generate positive attention, strengthen the studio's legacy, and align with similar actions taken by other game studios worldwide.",
      "The original source code and internal tools likely no longer serve any practical purpose for the studio. Yet for the community, they could unlock entirely new possibilities. They would give a fresh spark to hundreds of modders, programmers, and fans who have spent years reverse-engineering the game simply to keep it functioning.",
    ],
    signatureInvite:
      "And to everyone who supports this initiative, we welcome your signature below.",
    formTitle: "Sign the Petition",
    form: {
      nameLabel: "Name",
      emailLabel: "Email",
      emailOptional: "(optional)",
      messageLabel: "Message",
      messageOptional: "(optional)",
      namePlaceholder: "Your name",
      emailPlaceholder: "your@email.com",
      messagePlaceholder: "Add a personal message to your signature...",
      submit: "Sign the Petition",
      submitting: "Sending...",
    },
    signaturesTitle: "Recent Signatures",
    listLoading: "Loading signatures...",
    listEmpty: "No signatures yet. Be the first to sign.",
    signaturesCount: (count: number) =>
      `${count} ${count === 1 ? "signature" : "signatures"} so far`,
    galleryTitle: "Community Creations",
    galleryDescription:
      "Over two decades of passion, creativity, and countless hours of work from modders around the world. These are just a few examples of what the community has achieved.",
    contactTitle: "Have Information to Share?",
    contactDescription:
      "If you have any information about what can be done with this request, or if you'd like to support this initiative in any way, please reach out to us.",
    contactLinkLabel: "mafiaopensource@gmail.com",
    footerText: "This is a fan-driven community initiative.",
    footerContact: "Contact",
    toasts: {
      nameRequiredTitle: "Name required",
      nameRequiredDesc: "Please enter your name to sign the petition.",
      loadErrorTitle: "Unable to load signatures",
      loadErrorDesc: "Please try again in a moment.",
      thankYouTitle: "Thank you for signing!",
      thankYouDesc: "Your support means everything to the community.",
      submitErrorTitle: "Unable to send your signature",
      submitErrorFallback: "Please try again later.",
    },
  },
  cs: {
    heroTitle: "Open Source Mafia: The City of Lost Heaven",
    heroSubtitle: "Výzva společnosti Hangar 13",
    petitionIntro: [
      "Jsme dlouholetá modderská komunita, která udržuje původní Mafii: The City of Lost Heaven při životě už od jejího vydání v roce 2002. Během let vzniklo nespočet modifikací, technických vylepšení, nových modelů aut, neoficiálních patchů, editorů a dalších fanouškovských projektů — vše čistě z nadšení.",
      "Díky této práci je původní Mafia stále hratelná na moderních systémech a dodnes si získává nové hráče. Komunita udržuje její odkaz a viditelnost už více než dvě desetiletí — aniž by za to cokoli očekávala.",
      "Mnoho tvůrců, kteří formovali modderskou scénu, je aktivních dodnes a hru neustále vylepšuje, aby mohla přežít i pro další generace. Proto zveřejňujeme tuto výzvu:",
    ],
    petitionHighlight:
      "S úctou žádáme Hangar 13 o zveřejnění původní Mafie jako open-source projektu — včetně všech dostupných nástrojů, editorů a zdrojů, které by komunitě pomohly hru dále zachovat.",
    petitionMiddle: [
      "Upřímně věříme, že by to bylo výhodné pro obě strany. Otevření zdrojových kódů by umožnilo, aby Mafia dál žila, oslovovala nové publikum a byla dlouhodobě uchována. Pro Hangar 13 by to byl silný projev vstřícnosti — ocenění komunity, která sérii Mafia věrně podporuje více než 20 let. Přineslo by to pozitivní ohlas, posílilo pověst studia a zapadlo by to do kroků, které už některá herní studia ve světě udělala.",
      "Původní zdrojové kódy a interní nástroje dnes pro studio pravděpodobně nemají žádné praktické využití. Pro komunitu by ale znamenaly otevření zcela nových možností. Vdechly by novou energii stovkám moderů, programátorů a fanoušků, kteří hru už roky reverse-engineerují jen proto, aby mohla dál fungovat.",
    ],
    signatureInvite:
      "Každému, kdo tuto iniciativu podporuje, děkujeme a budeme rádi za podpis níže.",
    formTitle: "Podepiš petici",
    form: {
      nameLabel: "Jméno",
      emailLabel: "Email",
      emailOptional: "(volitelné)",
      messageLabel: "Zpráva",
      messageOptional: "(volitelné)",
      namePlaceholder: "Tvé jméno",
      emailPlaceholder: "tvoje@email.cz",
      messagePlaceholder: "Přidej osobní vzkaz k podpisu...",
      submit: "Podepsat petici",
      submitting: "Odesílám...",
    },
    signaturesTitle: "Poslední podpisy",
    listLoading: "Načítám podpisy...",
    listEmpty: "Zatím žádné podpisy. Buď první.",
    signaturesCount: (count: number) => {
      if (count === 1) return "1 podpis";
      if (count >= 2 && count <= 4) return `${count} podpisy`;
      return `${count} podpisů`;
    },
    galleryTitle: "Tvorba komunity",
    galleryDescription:
      "Více než dvě dekády plné nadšení, kreativity a nespočtu hodin práce od modderů z celého světa. Tohle je jen malá ukázka toho, čeho komunita dosáhla.",
    contactTitle: "Máte informace, které by pomohly?",
    contactDescription:
      "Pokud máte tipy, co se s touto výzvou dá dělat, nebo chcete iniciativu podpořit, napište nám.",
    contactLinkLabel: "mafiaopensource@gmail.com",
    footerText: "Tohle je fanouškovská komunitní iniciativa.",
    footerContact: "Kontakt",
    toasts: {
      nameRequiredTitle: "Jméno je povinné",
      nameRequiredDesc: "Prosím vyplň své jméno, aby šel podpis odeslat.",
      loadErrorTitle: "Nepodařilo se načíst podpisy",
      loadErrorDesc: "Zkus to prosím za chvíli.",
      thankYouTitle: "Díky za podpis!",
      thankYouDesc: "Podpora komunity je pro nás klíčová.",
      submitErrorTitle: "Podpis se nepodařilo uložit",
      submitErrorFallback: "Zkus to prosím znovu.",
    },
  },
};

const formatDate = (value: string) => {
  try {
    return format(new Date(value), "MM/dd/yyyy");
  } catch {
    return value;
  }
};

const Index = () => {
  const { toast } = useToast();
  const [language, setLanguage] = useState<Language>("en");
  const t = translations[language];
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingSignatures, setIsLoadingSignatures] = useState(true);
  const [signatures, setSignatures] = useState<Signature[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const galleryImages: { src: string; alt: Record<Language, string> }[] = [
    {
      src: img01,
      alt: { en: "Community creation 1", cs: "Tvorba komunity 1" },
    },
    {
      src: img033,
      alt: { en: "Community creation 2", cs: "Tvorba komunity 2" },
    },
    {
      src: imgCcb462,
      alt: { en: "Community creation 3", cs: "Tvorba komunity 3" },
    },
    {
      src: imgCcdemo9b,
      alt: { en: "Community creation 4", cs: "Tvorba komunity 4" },
    },
    {
      src: imgDarkVillage,
      alt: { en: "Community creation 5", cs: "Tvorba komunity 5" },
    },
    {
      src: imgDownload,
      alt: { en: "Community creation 6", cs: "Tvorba komunity 6" },
    },
    {
      src: imgGame20141219,
      alt: { en: "Community creation 7", cs: "Tvorba komunity 7" },
    },
    {
      src: imgHq720,
      alt: { en: "Community creation 8", cs: "Tvorba komunity 8" },
    },
    {
      src: imgHq720Alt,
      alt: { en: "Community creation 9", cs: "Tvorba komunity 9" },
    },
    {
      src: imgImages,
      alt: { en: "Community creation 10", cs: "Tvorba komunity 10" },
    },
    {
      src: imgImages1,
      alt: { en: "Community creation 11", cs: "Tvorba komunity 11" },
    },
    {
      src: imgImages2,
      alt: { en: "Community creation 12", cs: "Tvorba komunity 12" },
    },
    {
      src: imgJha,
      alt: { en: "Community creation 13", cs: "Tvorba komunity 13" },
    },
    {
      src: imgMaxres,
      alt: { en: "Community creation 14", cs: "Tvorba komunity 14" },
    },
    {
      src: imgMaxres1,
      alt: { en: "Community creation 15", cs: "Tvorba komunity 15" },
    },
    {
      src: imgMwe2,
      alt: { en: "Community creation 16", cs: "Tvorba komunity 16" },
    },
    {
      src: imgMwe21,
      alt: { en: "Community creation 17", cs: "Tvorba komunity 17" },
    },
    {
      src: imgSkodaFabia,
      alt: { en: "Community creation 18", cs: "Tvorba komunity 18" },
    },
    {
      src: imgSkoda105,
      alt: { en: "Community creation 19", cs: "Tvorba komunity 19" },
    },
    {
      src: imgSrp,
      alt: { en: "Community creation 20", cs: "Tvorba komunity 20" },
    },
    {
      src: imgU4f,
      alt: { en: "Community creation 21", cs: "Tvorba komunity 21" },
    },
  ];

  const imagesPerPage = 6;
  const totalPages = Math.ceil(galleryImages.length / imagesPerPage);
  const startIndex = (currentPage - 1) * imagesPerPage;
  const endIndex = startIndex + imagesPerPage;
  const currentImages = galleryImages.slice(startIndex, endIndex);

  const openLightbox = (index: number) => {
    setLightboxIndex(startIndex + index);
    setLightboxOpen(true);
  };

  const nextImage = () => {
    setLightboxIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevImage = () => {
    setLightboxIndex(
      (prev) => (prev - 1 + galleryImages.length) % galleryImages.length
    );
  };

  useEffect(() => {
    const loadSignatures = async () => {
      setIsLoadingSignatures(true);
      try {
        const response = await fetch("/api/signatures");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.error || t.toasts.loadErrorDesc);
        }

        setSignatures(Array.isArray(data?.signatures) ? data.signatures : []);
      } catch (error) {
        toast({
          title: t.toasts.loadErrorTitle,
          description: t.toasts.loadErrorDesc,
          variant: "destructive",
        });
      } finally {
        setIsLoadingSignatures(false);
      }
    };

    loadSignatures();
  }, [toast, language, t.toasts.loadErrorDesc, t.toasts.loadErrorTitle]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast({
        title: t.toasts.nameRequiredTitle,
        description: t.toasts.nameRequiredDesc,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/signatures", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim() || undefined,
          message: message.trim() || undefined,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data?.error || t.toasts.submitErrorFallback);
      }

      const savedSignature: Signature = data?.signature ?? {
        id: crypto.randomUUID?.() ?? `${Date.now()}`,
        name: name.trim(),
        email: email.trim() || undefined,
        message: message.trim() || undefined,
        date: new Date().toISOString(),
      };

      setSignatures((prev) => [savedSignature, ...prev]);
      setName("");
      setEmail("");
      setMessage("");

      toast({
        title: t.toasts.thankYouTitle,
        description: t.toasts.thankYouDesc,
      });
    } catch (error) {
      toast({
        title: t.toasts.submitErrorTitle,
        description:
          error instanceof Error ? error.message : t.toasts.submitErrorFallback,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-inter">
      <div className="fixed top-4 left-4 z-50">
        <a
          href="https://github.com/b4rtt/open-source-mafia"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 bg-background/80 backdrop-blur border border-border rounded-full px-3 py-2 shadow-lg text-sm hover:border-primary hover:text-primary transition-colors"
        >
          <Github className="w-4 h-4" />
          <span className="hidden sm:inline">GitHub · feel free to PR</span>
          <span className="sm:hidden">GitHub</span>
        </a>
      </div>

      <div className="fixed top-4 right-4 z-50">
        <div className="flex items-center gap-2 bg-background/80 backdrop-blur border border-border rounded-full px-3 py-2 shadow-lg">
          <div className="flex items-center gap-1 bg-card/80 rounded-full p-1">
            <Button
              variant="ghost"
              size="sm"
              className={`rounded-full px-3 text-sm transition-all ${
                language === "en"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setLanguage("en")}
              aria-label="English"
            >
              <span className="text-lg leading-none">🇺🇸</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`rounded-full px-3 text-sm transition-all ${
                language === "cs"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setLanguage("cs")}
              aria-label="Čeština"
            >
              <span className="text-lg leading-none">🇨🇿</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="border-b border-border">
        <div className="container max-w-4xl mx-auto px-4 py-12 md:py-20">
          <div className="flex flex-col items-center text-center space-y-6 animate-fade-in">
            <img
              src={mafiaLogo}
              alt="Mafia: The City of Lost Heaven"
              className="w-32 h-32 md:w-40 md:h-40 object-contain opacity-90"
            />
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-aurora font-bold tracking-tight">
              {t.heroTitle}
              <span className="block mt-2 text-xl md:text-3xl font-normal text-muted-foreground font-playfair">
                {t.heroSubtitle}
              </span>
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-3xl mx-auto px-4 py-12 md:py-16 space-y-16">
        {/* Petition Text */}
        <section className="prose prose-invert prose-lg max-w-none animate-fade-in-delay">
          <div className="space-y-6 text-foreground/90 leading-relaxed">
            {t.petitionIntro.map((paragraph, index) => (
              <p key={`intro-${index}`}>{paragraph}</p>
            ))}

            <p className="text-xl font-playfair font-semibold text-primary border-l-4 border-primary pl-6 py-2 my-8">
              {t.petitionHighlight}
            </p>

            {t.petitionMiddle.map((paragraph, index) => (
              <p key={`middle-${index}`}>{paragraph}</p>
            ))}

            <p className="text-lg font-semibold">{t.signatureInvite}</p>
          </div>
        </section>

        {/* Signature Form */}
        <section className="border-t border-border pt-12">
          <h2 className="text-3xl md:text-4xl font-playfair font-bold mb-8 text-center">
            {t.formTitle}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6 max-w-xl mx-auto">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium block">
                {t.form.nameLabel} <span className="text-primary">*</span>
              </label>
              <Input
                id="name"
                type="text"
                placeholder={t.form.namePlaceholder}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-secondary border-border focus:border-primary transition-colors"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium block">
                {t.form.emailLabel}{" "}
                <span className="text-muted-foreground text-xs">
                  {t.form.emailOptional}
                </span>
              </label>
              <Input
                id="email"
                type="email"
                placeholder={t.form.emailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-secondary border-border focus:border-primary transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium block">
                {t.form.messageLabel}{" "}
                <span className="text-muted-foreground text-xs">
                  {t.form.messageOptional}
                </span>
              </label>
              <Textarea
                id="message"
                placeholder={t.form.messagePlaceholder}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="bg-secondary border-border focus:border-primary transition-colors min-h-24 resize-none"
                maxLength={200}
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 transition-all"
            >
              {isSubmitting ? t.form.submitting : t.form.submit}
            </Button>
          </form>
        </section>

        {/* Signatures List */}
        <section className="border-t border-border pt-12">
          <h2 className="text-2xl md:text-3xl font-playfair font-bold mb-8 text-center">
            {t.signaturesTitle}
          </h2>

          <div className="space-y-6">
            {isLoadingSignatures ? (
              <p className="text-center text-muted-foreground">
                {t.listLoading}
              </p>
            ) : signatures.length === 0 ? (
              <p className="text-center text-muted-foreground">{t.listEmpty}</p>
            ) : (
              signatures.map((sig, index) => (
                <div
                  key={sig.id ?? `${sig.name}-${sig.date}-${index}`}
                  className="bg-card border border-border rounded-lg p-6 transition-all hover:border-primary/50"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg">{sig.name}</h3>
                    <span className="text-sm text-muted-foreground">
                      {formatDate(sig.date)}
                    </span>
                  </div>
                  {sig.message && (
                    <p className="text-muted-foreground italic">
                      "{sig.message}"
                    </p>
                  )}
                </div>
              ))
            )}
          </div>

          <p className="text-center text-muted-foreground mt-8">
            {isLoadingSignatures
              ? t.listLoading
              : t.signaturesCount(signatures.length)}
          </p>
        </section>

        {/* Gallery Section */}
        <section className="border-t border-border pt-12">
          <h2 className="text-2xl md:text-3xl font-playfair font-bold mb-4 text-center">
            {t.galleryTitle}
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            {t.galleryDescription}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {currentImages.map((image, index) => (
              <div
                key={index}
                onClick={() => openLightbox(index)}
                className="group relative overflow-hidden rounded-lg border border-border bg-card transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 cursor-pointer"
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={image.src}
                    alt={image.alt[language]}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  {/* <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-sm text-foreground/90">{image.alt[language]}</p>
                  </div> */}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="transition-all disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className="w-10 h-10 transition-all"
                    >
                      {page}
                    </Button>
                  )
                )}
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
                className="transition-all disabled:opacity-50"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </section>

        {/* Contact Info Box */}
        <section className="border-t border-border pt-12">
          <div className="max-w-2xl mx-auto">
            <div className="bg-card border border-primary/30 rounded-lg p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Mail className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-playfair font-bold mb-3">
                {t.contactTitle}
              </h2>
              <p className="text-muted-foreground mb-6">
                {t.contactDescription}
              </p>
              <a
                href="mailto:mafiaopensource@gmail.com"
                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-semibold"
              >
                <Mail className="w-4 h-4" />
                {t.contactLinkLabel}
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Lightbox Dialog */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-7xl w-full p-0 bg-background/95 backdrop-blur">
          <div className="relative">
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-4 right-4 z-50 p-2 rounded-full bg-background/80 hover:bg-background transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-background/80 hover:bg-background transition-colors"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>

            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-background/80 hover:bg-background transition-colors"
            >
              <ChevronRight className="w-8 h-8" />
            </button>

            <div className="flex items-center justify-center min-h-[60vh] max-h-[90vh] p-4">
              <img
                src={galleryImages[lightboxIndex]?.src}
                alt={galleryImages[lightboxIndex]?.alt[language]}
                className="max-w-full max-h-full object-contain"
              />
            </div>

            <div className="p-6 border-t border-border bg-card/50">
              {/* <p className="text-center text-muted-foreground">
                {galleryImages[lightboxIndex]?.alt[language]}
              </p> */}
              <p className="text-center text-sm text-muted-foreground/60 mt-2">
                {lightboxIndex + 1} / {galleryImages.length}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="border-t border-border mt-16">
        <div className="container max-w-4xl mx-auto px-4 py-8 text-center">
          <p className="text-muted-foreground mb-2">{t.footerText}</p>
          <a
            href="mailto:mafiaopensource@gmail.com"
            className="text-primary hover:text-primary/80 transition-colors underline"
          >
            {t.footerContact}
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Index;
