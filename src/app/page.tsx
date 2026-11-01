import { BuildDemos } from '@/components/home/BuildDemos';
import { CareerJourney } from '@/components/home/CareerJourney';
import { CaseStack } from '@/components/home/CaseStack';
import { CompaniesGrid } from '@/components/home/CompaniesGrid';
import { Contact } from '@/components/home/Contact';
import { Hero } from '@/components/home/Hero';
import { Impact } from '@/components/home/Impact';
import { LeadBuild } from '@/components/home/LeadBuild';
import { Principles } from '@/components/home/Principles';
import { HomeFooter } from '@/components/layout/SiteFooter';
import { HomeHeader } from '@/components/nav/HomeHeader';

export default function Home() {
  return (
    <>
      <HomeHeader />
      <main>
        <Hero />
        <LeadBuild />
        <Impact />
        <CompaniesGrid />
        <BuildDemos />
        <CareerJourney />
        <CaseStack />
        <Principles />
        <Contact />
      </main>
      <HomeFooter />
    </>
  );
}
