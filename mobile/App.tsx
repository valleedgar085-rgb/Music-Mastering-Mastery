import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const C = {
  bg: '#071012',
  panel: '#101A1E',
  panel2: '#172228',
  line: '#26343A',
  text: '#F5F7F8',
  muted: '#9AA7AD',
  accent: '#55E6A5',
  accentDark: '#0C6F50',
};

type Screen = 'welcome' | 'home' | 'lesson';

export default function App() {
  const [screen, setScreen] = useState<Screen>('welcome');

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />
      {screen === 'welcome' && <Welcome onStart={() => setScreen('home')} />}
      {screen === 'home' && <Home onLesson={() => setScreen('lesson')} />}
      {screen === 'lesson' && <Lesson onBack={() => setScreen('home')} />}
    </SafeAreaView>
  );
}

function Welcome({ onStart }: { onStart: () => void }) {
  return (
    <ScrollView contentContainerStyle={styles.welcomeWrap}>
      <View style={styles.wordmarkRow}>
        <Text style={styles.muted}>Mix Learn Create</Text>
        <Text style={styles.muted}>FL STUDIO</Text>
      </View>

      <View style={styles.heroArt}>
        <View style={[styles.bar, { height: 42 }]} />
        <View style={[styles.bar, { height: 78 }]} />
        <View style={[styles.bar, { height: 54 }]} />
        <View style={[styles.bar, { height: 116 }]} />
        <View style={[styles.bar, { height: 88 }]} />
        <View style={[styles.bar, { height: 138 }]} />
        <View style={[styles.bar, { height: 72 }]} />
      </View>

      <Text style={styles.heroTitle}>Master{`\n`}Your <Text style={styles.accent}>Sound</Text></Text>
      <Text style={styles.body}>Learn mixing and mastering on FL Studio with step-by-step lessons, practical projects, and real workflows for every level.</Text>

      <Feature icon="▣" title="Structured Lessons" text="Go from basics to advanced" />
      <Feature icon="⌁" title="Real Projects" text="Learn by doing" />
      <Feature icon="▥" title="Pro Techniques" text="Modern, practical, and clear" />

      <TouchableOpacity style={styles.primary} onPress={onStart} activeOpacity={0.85}>
        <Text style={styles.primaryText}>Get Started  →</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onStart}><Text style={styles.link}>Explore the App</Text></TouchableOpacity>
    </ScrollView>
  );
}

function Feature({ icon, title, text }: { icon: string; title: string; text: string }) {
  return (
    <View style={styles.featureRow}>
      <View style={styles.featureIcon}><Text style={styles.featureIconText}>{icon}</Text></View>
      <View style={{ flex: 1 }}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.muted}>{text}</Text>
      </View>
    </View>
  );
}

function Home({ onLesson }: { onLesson: () => void }) {
  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.page}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.pageTitle}>Learn</Text>
            <Text style={styles.muted}>Mixing • Mastering • FL Studio</Text>
          </View>
          <Text style={styles.bell}>♧</Text>
        </View>

        <View style={styles.search}><Text style={styles.searchText}>⌕  Search lessons, topics, or tools...</Text></View>

        <View style={styles.tabs}>
          <View style={styles.tabActive}><Text style={styles.tabActiveText}>Home</Text></View>
          <Text style={styles.tabText}>Lessons</Text>
          <Text style={styles.tabText}>Projects</Text>
          <Text style={styles.tabText}>Tools</Text>
        </View>

        <TouchableOpacity style={styles.featuredCard} onPress={onLesson} activeOpacity={0.9}>
          <Text style={styles.badge}>FEATURED</Text>
          <Text style={styles.cardTitle}>Complete Mixing Workflow</Text>
          <Text style={styles.cardBody}>From raw beat to polished track in FL Studio.</Text>
          <View style={styles.watchRow}><View style={styles.play}><Text style={styles.playText}>▶</Text></View><Text style={styles.watchText}>Watch Lesson</Text></View>
        </TouchableOpacity>

        <SectionTitle title="Continue Learning" />
        <TouchableOpacity style={styles.continueCard} onPress={onLesson}>
          <View style={styles.thumb}><Text style={styles.thumbText}>▶</Text></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.itemTitle}>EQ Fundamentals{`\n`}in FL Studio</Text>
            <View style={styles.progressTrack}><View style={styles.progressFill} /></View>
          </View>
          <Text style={styles.muted}>60%</Text>
        </TouchableOpacity>

        <SectionTitle title="Learning Paths" />
        <View style={styles.pathRow}>
          <Path title="Beginner" sub="Build a solid foundation" icon="◒" />
          <Path title="Intermediate" sub="Improve your mixes" icon="▥" />
          <Path title="Advanced" sub="Master your sound" icon="≋" />
        </View>

        <SectionTitle title="Quick Tools" />
        <View style={styles.pathRow}>
          <Path title="Mixer Guide" sub="" icon="☷" />
          <Path title="Plugin Guide" sub="" icon="✚" />
          <Path title="Checklist" sub="" icon="☑" />
        </View>
      </ScrollView>
      <View style={styles.bottomNav}>
        <Nav icon="⌂" label="Learn" active />
        <Nav icon="▷" label="Practice" />
        <Nav icon="□" label="Library" />
        <Nav icon="•••" label="More" />
      </View>
    </View>
  );
}

function SectionTitle({ title }: { title: string }) {
  return <View style={styles.sectionHead}><Text style={styles.sectionTitle}>{title}</Text><Text style={styles.seeAll}>See All</Text></View>;
}

function Path({ title, sub, icon }: { title: string; sub: string; icon: string }) {
  return <View style={styles.pathCard}><Text style={styles.pathIcon}>{icon}</Text><Text style={styles.pathTitle}>{title}</Text>{sub ? <Text style={styles.pathSub}>{sub}</Text> : null}</View>;
}

function Nav({ icon, label, active = false }: { icon: string; label: string; active?: boolean }) {
  return <View style={styles.navItem}><Text style={[styles.navIcon, active && { color: C.accent }]}>{icon}</Text><Text style={[styles.navLabel, active && { color: C.accent }]}>{label}</Text></View>;
}

function Lesson({ onBack }: { onBack: () => void }) {
  return (
    <ScrollView contentContainerStyle={styles.lessonPage}>
      <View style={styles.lessonTop}><TouchableOpacity onPress={onBack}><Text style={styles.back}>‹</Text></TouchableOpacity><Text style={styles.lessonTopTitle}>Lesson</Text><Text style={styles.bookmark}>♡</Text></View>

      <View style={styles.video}>
        <View style={styles.eqGrid} />
        <View style={styles.videoPlay}><Text style={styles.videoPlayText}>▶</Text></View>
        <Text style={styles.videoTime}>▶  0:00 / 12:34</Text>
      </View>

      <Text style={styles.badgeSmall}>MIXING</Text>
      <Text style={styles.lessonTitle}>EQ Fundamentals in FL Studio</Text>
      <Text style={styles.body}>Learn how to use EQ to clean, balance, and shape your mix like a pro.</Text>

      <View style={styles.metaRow}>
        <Meta text="◷  12 min" />
        <Meta text="▥  Beginner" />
        <Meta text="▣  Includes Project" />
      </View>

      <TouchableOpacity style={styles.primary}><Text style={styles.primaryText}>▶  Resume Lesson</Text></TouchableOpacity>

      <View style={styles.lessonTabs}><Text style={styles.lessonTabActive}>Overview</Text><Text style={styles.lessonTab}>Chapters</Text><Text style={styles.lessonTab}>Files</Text><Text style={styles.lessonTab}>Notes</Text></View>

      <Text style={styles.paragraph}>In this lesson, you’ll learn how to use EQ effectively in FL Studio. We’ll cover subtraction, boosting, frequency ranges, and practical examples on drums, melodies, and vocals.</Text>

      <Text style={styles.learnHeading}>What You’ll Learn</Text>
      <Check text="Understand frequency ranges" />
      <Check text="Clean up muddiness and unwanted frequencies" />
      <Check text="Use EQ on drums, melodies, and vocals" />
      <Check text="Apply EQ in a real mix example" />

      <View style={styles.projectCard}><Text style={styles.projectIcon}>□</Text><View style={{ flex: 1 }}><Text style={styles.itemTitle}>Project Files</Text><Text style={styles.muted}>Download the FLP used in this lesson</Text></View><Text style={styles.download}>⇩</Text></View>
    </ScrollView>
  );
}

function Meta({ text }: { text: string }) { return <View style={styles.meta}><Text style={styles.metaText}>{text}</Text></View>; }
function Check({ text }: { text: string }) { return <View style={styles.checkRow}><Text style={styles.check}>✓</Text><Text style={styles.checkText}>{text}</Text></View>; }

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  welcomeWrap: { padding: 28, paddingBottom: 36, flexGrow: 1 },
  wordmarkRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 22 },
  muted: { color: C.muted, fontSize: 14 },
  heroArt: { height: 240, backgroundColor: '#0B171A', borderRadius: 28, marginBottom: 28, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-evenly', padding: 24, overflow: 'hidden' },
  bar: { width: 18, borderRadius: 9, backgroundColor: '#EACB65', opacity: 0.92 },
  heroTitle: { color: C.text, fontSize: 48, lineHeight: 49, fontWeight: '800', letterSpacing: -1.5 },
  accent: { color: C.accent },
  body: { color: '#CED6D9', fontSize: 16, lineHeight: 24, marginTop: 16, marginBottom: 24 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 18 },
  featureIcon: { width: 52, height: 52, borderRadius: 16, backgroundColor: '#0C2B25', alignItems: 'center', justifyContent: 'center' },
  featureIconText: { color: C.accent, fontSize: 25 },
  featureTitle: { color: C.text, fontWeight: '700', fontSize: 16, marginBottom: 3 },
  primary: { backgroundColor: C.accent, borderRadius: 16, paddingVertical: 17, alignItems: 'center', marginTop: 18 },
  primaryText: { color: '#032117', fontWeight: '800', fontSize: 16 },
  link: { color: C.accent, textAlign: 'center', marginTop: 18, fontSize: 15 },
  page: { padding: 20, paddingBottom: 110 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  pageTitle: { color: C.text, fontSize: 34, fontWeight: '800' },
  bell: { color: C.text, fontSize: 28 },
  search: { backgroundColor: C.panel2, borderRadius: 18, borderWidth: 1, borderColor: '#425159', padding: 15, marginTop: 18 },
  searchText: { color: C.muted },
  tabs: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 16 },
  tabActive: { backgroundColor: C.accent, borderRadius: 22, paddingHorizontal: 25, paddingVertical: 11 },
  tabActiveText: { color: '#062018', fontWeight: '700' },
  tabText: { color: '#B4BDC1', fontWeight: '600' },
  featuredCard: { backgroundColor: '#10272A', borderColor: C.accentDark, borderWidth: 1.5, borderRadius: 20, padding: 20, minHeight: 190 },
  badge: { backgroundColor: C.accent, color: '#032116', alignSelf: 'flex-start', paddingHorizontal: 9, paddingVertical: 5, borderRadius: 5, fontSize: 11, fontWeight: '900' },
  cardTitle: { color: C.text, fontSize: 25, fontWeight: '800', marginTop: 16, maxWidth: 260 },
  cardBody: { color: '#C2CCCF', marginTop: 8, fontSize: 15 },
  watchRow: { flexDirection: 'row', alignItems: 'center', marginTop: 18, gap: 10 },
  play: { width: 38, height: 38, borderRadius: 19, backgroundColor: C.accent, alignItems: 'center', justifyContent: 'center' },
  playText: { color: '#042016' },
  watchText: { color: C.text, fontWeight: '700' },
  sectionHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 26, marginBottom: 12 },
  sectionTitle: { color: C.text, fontSize: 21, fontWeight: '800' },
  seeAll: { color: C.accent, fontWeight: '700' },
  continueCard: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 12, backgroundColor: C.panel2, borderRadius: 18 },
  thumb: { width: 110, height: 72, borderRadius: 14, backgroundColor: '#24343C', alignItems: 'center', justifyContent: 'center' },
  thumbText: { color: C.text, fontSize: 24 },
  itemTitle: { color: C.text, fontWeight: '700', fontSize: 15 },
  progressTrack: { height: 7, backgroundColor: '#334047', borderRadius: 10, marginTop: 13, overflow: 'hidden' },
  progressFill: { width: '60%', height: '100%', backgroundColor: C.accent, borderRadius: 10 },
  pathRow: { flexDirection: 'row', gap: 10 },
  pathCard: { flex: 1, minHeight: 130, backgroundColor: C.panel2, borderColor: '#39474E', borderWidth: 1, borderRadius: 18, padding: 14, alignItems: 'center', justifyContent: 'center' },
  pathIcon: { color: C.accent, fontSize: 28, marginBottom: 10 },
  pathTitle: { color: C.text, fontSize: 14, fontWeight: '700', textAlign: 'center' },
  pathSub: { color: C.muted, fontSize: 11, lineHeight: 15, textAlign: 'center', marginTop: 6 },
  bottomNav: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 82, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', backgroundColor: '#081214', borderTopWidth: 1, borderTopColor: C.line },
  navItem: { alignItems: 'center' },
  navIcon: { color: '#B3BDC0', fontSize: 23 },
  navLabel: { color: '#B3BDC0', fontSize: 11, marginTop: 4 },
  lessonPage: { paddingBottom: 34 },
  lessonTop: { height: 62, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  back: { color: C.text, fontSize: 42, lineHeight: 42 },
  lessonTopTitle: { color: C.text, fontWeight: '700', fontSize: 19 },
  bookmark: { color: C.text, fontSize: 26 },
  video: { height: 240, backgroundColor: '#1B2A31', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  eqGrid: { ...StyleSheet.absoluteFillObject, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#31454E', opacity: 0.8 },
  videoPlay: { width: 68, height: 68, borderRadius: 34, backgroundColor: '#081214CC', borderWidth: 1, borderColor: '#52636B', alignItems: 'center', justifyContent: 'center' },
  videoPlayText: { color: C.text, fontSize: 27 },
  videoTime: { position: 'absolute', left: 16, bottom: 13, color: C.text, fontSize: 12 },
  badgeSmall: { color: C.accent, backgroundColor: '#0D382D', fontWeight: '800', fontSize: 11, alignSelf: 'flex-start', marginLeft: 20, marginTop: 18, borderRadius: 5, paddingHorizontal: 8, paddingVertical: 4 },
  lessonTitle: { color: C.text, fontSize: 25, fontWeight: '800', marginHorizontal: 20, marginTop: 12 },
  metaRow: { flexDirection: 'row', gap: 7, marginHorizontal: 20, marginTop: 2 },
  meta: { backgroundColor: C.panel2, borderRadius: 18, paddingHorizontal: 10, paddingVertical: 8 },
  metaText: { color: '#D3DADD', fontSize: 11 },
  lessonTabs: { flexDirection: 'row', justifyContent: 'space-around', borderBottomWidth: 1, borderBottomColor: C.line, marginTop: 22 },
  lessonTab: { color: C.muted, paddingVertical: 15, fontSize: 13 },
  lessonTabActive: { color: C.accent, paddingVertical: 15, fontSize: 13, borderBottomWidth: 3, borderBottomColor: C.accent },
  paragraph: { color: '#D4DBDE', fontSize: 15, lineHeight: 23, margin: 20 },
  learnHeading: { color: C.text, fontSize: 20, fontWeight: '800', marginHorizontal: 20, marginBottom: 12 },
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginHorizontal: 20, marginBottom: 10 },
  check: { width: 21, height: 21, borderRadius: 11, textAlign: 'center', textAlignVertical: 'center', backgroundColor: C.accent, color: '#08241A', fontWeight: '900' },
  checkText: { color: '#E1E6E8', flex: 1 },
  projectCard: { flexDirection: 'row', alignItems: 'center', gap: 14, margin: 20, padding: 18, backgroundColor: C.panel2, borderRadius: 16, borderWidth: 1, borderColor: '#35454C' },
  projectIcon: { color: '#D7E0E3', fontSize: 28 },
  download: { color: '#D7E0E3', fontSize: 25 },
});
