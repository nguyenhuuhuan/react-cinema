import { ValueText } from "onecore";
import * as React from "react";
import {
  OnClick,
  SearchComponentState,
  useSearch,
  value,
} from "react-hook-core";
import { PageSizeSelect } from "react-page-size-select";
import { useNavigate } from "react-router-dom";
import { Pagination } from "reactx-pagination";
import { inputSearch } from "uione";
import { Location, LocationFilter } from "./service/location/location";
import { getLocations } from "./service/index";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import * as Leaflet from "leaflet";
import "leaflet/dist/leaflet.css";
import UserCarousel from "../admin/users_carousel/app";

interface LocationSearch
  extends SearchComponentState<Location, LocationFilter> {
  statusList: ValueText[];
}
const userFilter: LocationFilter = {
  id: "",
  name: "",
  description: "",
  longitude: 0,
  latitude: 0,
};
const initialState: LocationSearch = {
  statusList: [],
  list: [],
  filter: userFilter,
};
export const LocationsForm = () => {
  const refForm = React.useRef();
  const navigate = useNavigate();
  const {
    state,
    resource,
    component,
    updateState,

    search,
    sort,
    toggleFilter,
    changeView,
    pageChanged,
    pageSizeChanged,
  } = useSearch<Location, LocationFilter, LocationSearch>(
    refForm,
    initialState,
    getLocations(),
    inputSearch()
  );
  component.viewable = true;
  component.editable = true;
  const [listStatus, setListStatus] = React.useState(true);
  React.useEffect(() => {
    const L = require("leaflet");

    delete L.Icon.Default.prototype._getIconUrl;

    L.Icon.Default.mergeOptions({
      iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
      iconUrl: require("leaflet/dist/images/marker-icon.png"),
      shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
    });
  }, []);

  const viewDetail = (
    e: React.MouseEvent<HTMLElement, MouseEvent>,
    id: string
  ) => {
    e.preventDefault();
    navigate(`${id}`);
  };

  const edit = (e: React.MouseEvent<HTMLElement, MouseEvent>, id: string) => {
    e.preventDefault();
    navigate(`edit/${id}`);
  };
  const [viewList, setViewList] = React.useState(true);
  const [list, setList] = React.useState<Location[]>([]);
  const [filter, setFilter] = React.useState<LocationFilter>(
    value(state.filter)
  );
  React.useEffect(() => {
    if (state.list) setList(state.list);
    if (state.filter) setFilter(state.filter);
  }, [state]);

  const onSetViewList = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setViewList(!viewList);
  };

  const addMarker = (e: Leaflet.LeafletMouseEvent) => {
    const currentPos = e.latlng;
    console.log(currentPos);
    const newLocation = {
      longitude: currentPos.lat,
      latitude: currentPos.lng,
      id: currentPos.lng.toString(),
      name: "you are here",
      description: "description",
      type: "",
      status: "1",
    };
    setList([...list, newLocation]);
  };
  const add = (e: OnClick) => {
    e.preventDefault();
    navigate(`add`);
  };

  return (
    <div className="view-container">
      <header>
        <h2>{resource.users}</h2>
        <div className="btn-group">
          {!viewList && (
            <button
              type="button"
              id="btnListView"
              name="btnListView"
              className="btn-list-view"
              data-view="listview"
              onClick={(e) => onSetViewList(e)}
            />
          )}
          {viewList && (
            <button
              type="button"
              id="btnListView"
              name="btnListView"
              className="btn-map"
              data-view="listview"
              onClick={(e) => onSetViewList(e)}
            >
              <span className="material-icons-outlined"></span>
            </button>
          )}
          {component.addable && (
            <button
              type="button"
              id="btnNew"
              name="btnNew"
              className="btn-new"
              onClick={add}
            />
          )}
        </div>
      </header>
      <div>
        <form
          id="usersForm"
          name="usersForm"
          noValidate={true}
          ref={refForm as any}
        >
          <section className="row search-group">
            <label className="col s12 m4 search-input">
              <PageSizeSelect
                size={component.pageSize}
                sizes={component.pageSizes}
                onChange={pageSizeChanged}
              />
              <input
                type="text"
                id="q"
                name="q"
                value={filter.q || ""}
                onChange={updateState}
                maxLength={255}
                placeholder={resource.keyword}
              />
              <button
                type="button"
                className="btn-filter"
                onClick={toggleFilter}
              />
              <button type="submit" className="btn-search" onClick={search} />
            </label>
            <Pagination
              className="col s12 m8"
              total={component.total}
              size={component.pageSize}
              max={component.pageMaxSize}
              page={component.pageIndex}
              onChange={pageChanged}
            />
          </section>
          <section
            className="row search-group inline"
            hidden={component.hideFilter}
          >
            <label className="col s12 m4 l4">
              {resource.username}
              <input
                type="text"
                id="name"
                name="name"
                value={filter.name || ""}
                onChange={updateState}
                maxLength={255}
                placeholder={resource.username}
              />
            </label>
          </section>
        </form>
        <form className="list-result">
          {viewList && (
            <section className="btn-group" style={{ paddingLeft: "16px" }}>
              <div
                className="btn-search"
                style={{ textAlign: "center", padding: "6px 0" }}
                onClick={() => setListStatus((l) => !l)}
              >
                {listStatus ? "Carousel" : "Items"}
              </div>
            </section>
          )}

          {component.view === "table" && (
            <div className="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th>{resource.sequence}</th>
                    <th data-field="id">
                      <button type="button" id="sortId" onClick={sort}>
                        {resource.user_id}
                      </button>
                    </th>
                    <th data-field="username">
                      <button type="button" id="sortName" onClick={sort}>
                        {resource.username}
                      </button>
                    </th>
                  </tr>
                </thead>
                {list &&
                  list.length > 0 &&
                  list.map((user, i) => {
                    return (
                      <tr
                        key={"table" + i}
                        onClick={(e) => viewDetail(e, user.id)}
                      >
                        <td className="text-right">
                          {(user as any).sequenceNo}
                        </td>
                        <td>{user.id}</td>
                        <td>{user.name}</td>
                      </tr>
                    );
                  })}
              </table>
            </div>
          )}

          {viewList ? (
            <ul className="row list-view">
              {list &&
                list.length > 0 &&
                list.map((location, i) => (
                  <>
                    {" "}
                    {listStatus ? (
                      <li key={"list" + i} className="col s12 m6 l4 xl3 card">
                        <section>
                          <div
                            className="cover"
                            style={{
                              backgroundImage: `url('${location.imageURL}')`,
                            }}
                          ></div>
                          <div style={{ width: "100%", display: "flex" }}>
                            <h3 onClick={(e) => edit(e, location.id)}>
                              {location.name}
                            </h3>
                            <button
                              className="btn-detail"
                              onClick={(e) => viewDetail(e, location.id)}
                            />
                          </div>
                        </section>
                      </li>
                    ) : (
                      <li key={"carousel" + i} className="col s12 m6 l4 xl3">
                        <section>
                          <UserCarousel
                            user={{
                              userId: "location",
                              email: "",
                              displayName: "",
                              status: "1",
                              username: "test",
                            }}
                            edit={edit}
                          />
                        </section>
                      </li>
                    )}
                  </>
                ))}
            </ul>
          ) : (
            <div style={{ height: "600px", width: "800px" }}>
              <MapContainer
                center={{ lat: 10.854886268472459, lng: 106.63051128387453 }}
                zoom={16}
                maxZoom={100}
                attributionControl={true}
                zoomControl={true}
                scrollWheelZoom={true}
                dragging={true}
                animate={true}
                easeLinearity={0.35}
                style={{ height: "100%" }}
                onclick={addMarker}
              >
                <TileLayer
                  attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {list &&
                  list.map((location, idx) => (
                    <Marker
                      key={`marker-${idx}`}
                      position={[location.longitude, location.latitude]}
                    >
                      <Popup>
                        <span>{location.name}</span>
                      </Popup>
                    </Marker>
                  ))}
              </MapContainer>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
