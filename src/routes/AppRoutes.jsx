import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import DetailPage from "../pages/DetailPage";
import BrowseItemPage from "../pages/BrowseItemPage";
import BrowseSectionPage from "../pages/BrowseSectionPage";
import HomePage from "../pages/HomePage";

export default function AppRoutes({
  session,
  setShowAuth,
  openFromCard,
  openAddModal,
  profile,
  myEntries,
  customLists,
  setProfileDraft,
  setShowProfileEdit,
  openCreateList,
  openEditList,
  deleteCustomList,
  addEntryToList,
  removeEntryFromList,
  moveListItem,
  renderLibrary,
  PosterImage,
  handleTypeNav,
  allContent,
  page,
  heroItems,
  settings,
  HeroCarousel,
  TmdbSection,
  homeTrending,
  trendMode,
  handleTrendTab,
  homePopular,
  popularMode,
  handlePopularTab,
  homeFree,
  freeMode,
  handleFreeTab,
  homeSeries,
  setSeeAll,
  GenrePage,
  CategoryPage,
  ProfilePage,
  ListDetailPage,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Routes>
      <Route path="/detail/:type/:id" element={<DetailPage session={session} onRequireAuth={() => setShowAuth(true)} onSelect={openAddModal} />} />
      <Route
        path="/profile"
        element={
          <ProfilePage
            session={session}
            profile={profile}
            entries={myEntries}
            customLists={customLists}
            onEditProfile={() => { setProfileDraft(profile); setShowProfileEdit(true); }}
            onCreateList={openCreateList}
            onEditList={openEditList}
            onDeleteList={deleteCustomList}
            onOpenList={(listId) => navigate(`/list/${listId}`)}
            onRequireAuth={() => setShowAuth(true)}
          />
        }
      />
      <Route
        path="/list/:id"
        element={
          <ListDetailPage
            session={session}
            customLists={customLists}
            entries={myEntries}
            onOpenEntry={openFromCard}
            onEditList={openEditList}
            onDeleteList={deleteCustomList}
            onAddItem={addEntryToList}
            onRemoveItem={removeEntryFromList}
            onMoveItem={moveListItem}
            onRequireAuth={() => setShowAuth(true)}
          />
        }
      />
      <Route path="/explore/:section/:item" element={<BrowseItemPage />} />
      <Route path="/explore/:section" element={<BrowseSectionPage />} />
      <Route path="/explore" element={renderLibrary("explore")} />
      <Route
        path="/genre/:slug"
        element={
          <GenrePage
            onSelect={openFromCard}
            PosterImageComponent={PosterImage}
            onTypeNav={handleTypeNav}
          />
        }
      />
      <Route
        path="/category/:type"
        element={
          <CategoryPage
            key={location.pathname}
            allItems={allContent}
            onSelect={openFromCard}
            PosterImageComponent={PosterImage}
            onTypeNav={handleTypeNav}
          />
        }
      />
      <Route
        path="/*"
        element={
          <>
            {/*  HOME PAGE  */}
            {page === "home" && (
              <HomePage
                heroItems={heroItems}
                autoplay={settings.autoplay}
                onAdd={openFromCard}
                session={session}
                setShowAuth={setShowAuth}
                HeroCarousel={HeroCarousel}
                TmdbSection={TmdbSection}
                homeTrending={homeTrending}
                trendMode={trendMode}
                onTrendTabChange={handleTrendTab}
                homePopular={homePopular}
                popularMode={popularMode}
                onPopularTabChange={handlePopularTab}
                homeFree={homeFree}
                freeMode={freeMode}
                onFreeTabChange={handleFreeTab}
                homeSeries={homeSeries}
                onSelect={openFromCard}
                onTypeNav={handleTypeNav}
                onSeeAll={setSeeAll}
              />
            )}

            {/*  EXPLORE / MY LIST */}
            {page === "explore" && renderLibrary("explore")}

            {page === "mylist" && renderLibrary("mylist")}
          </>
        }
      />
    </Routes>
  );
}
