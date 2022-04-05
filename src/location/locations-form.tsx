import { ValueText } from "onecore";
import * as React from "react";
import {
  SearchComponentState,
  useSearch,
  value,
} from "react-hook-core";
import { PageSizeSelect } from "react-page-size-select";
import { useNavigate } from "react-router-dom";
import { Pagination } from "reactx-pagination";
import { inputSearch } from "uione";
import { Location, LocationFilter } from "./service/location/location";
import { useLocation } from "./service/index";
import { Map as LeafletMap, Marker, Popup, TileLayer } from "react-leaflet";
import * as Leaflet from 'leaflet';
import 'leaflet/dist/leaflet.css';


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
    useLocation(),
    inputSearch()
  );
  component.viewable = true;
  component.editable = true;
  React.useEffect(() => {
    const L = require("leaflet");

    delete L.Icon.Default.prototype._getIconUrl;

    L.Icon.Default.mergeOptions({
      iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
      iconUrl: require("leaflet/dist/images/marker-icon.png"),
      shadowUrl: require("leaflet/dist/images/marker-shadow.png")
    });
  }, []);

  const viewDetail = (e: React.MouseEvent<HTMLElement, MouseEvent>, id: string) => {
    e.preventDefault();
    navigate(`${id}`);
  };
  const [viewList, setViewList] = React.useState(true);
  const [list, setList] = React.useState<Location[]>([]);
  const [filter, setFilter] = React.useState<LocationFilter>(value(state.filter));
  React.useEffect(() => {
    if (state.list)
      setList(state.list);
    if (state.filter)
      setFilter(state.filter)
  }, [state]);

  const onSetViewList = (e: { preventDefault: () => void; }, view: boolean) => {
    e.preventDefault();
    setViewList(view)
  }

  const addMarker = (e: Leaflet.LeafletMouseEvent) => {
    const currentPos = e.latlng;
    console.log(currentPos)
    const newLocation = {
      longitude: currentPos.lat,
      latitude: currentPos.lng,
      id: currentPos.lng.toString(),
      name: 'you are here',
      description: 'description',
      type: '',
    }
    setList([...list, newLocation])
  }

  return (
    <div className="view-container">
      <header>
        <h2>{resource.users}</h2>
        <div className="btn-group">
          {component.view !== "table" && (
            <button
              type="button"
              id="btnTable"
              name="btnTable"
              className="btn-table"
              data-view="table"
              onClick={changeView}
            />
          )}
          {component.view === "table" && (
            <button
              type="button"
              id="btnListView"
              name="btnListView"
              className="btn-list-view"
              data-view="listview"
              onClick={changeView}
            />
          )}
          {/* {component.addable && (
            <button
              type="button"
              id="btnNew"
              name="btnNew"
              className="btn-new"
              onClick={add}
            />
          )} */}
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
                value={filter.q}
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
                value={filter.name}
                onChange={updateState}
                maxLength={255}
                placeholder={resource.username}
              />
            </label>
          </section>
        </form>
        <form className="list-result">
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
                      <tr key={i} onClick={(e) => viewDetail(e, user.id)}>
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
          <div>
            <button onClick={(e) => onSetViewList(e, true)}>Show List</button>
            <button onClick={(e) => onSetViewList(e, false)}>Show Map</button>
          </div>
          {viewList ? (
            component.view !== "table" && (
              <ul className="row list-view">
                {list &&
                  list.length > 0 &&
                  list.map((location, i) => {
                    return (
                      <li
                        key={i}
                        className="col s12 m6 l4 xl3"
                        onClick={(e) => viewDetail(e, location.id)}
                      >
                        <section>
                          <div>
                            <h3>{location.name}</h3>
                          </div>
                          <button className="btn-detail" />
                        </section>
                      </li>
                    );
                  })}
              </ul>
            )
          ) : (
            <div style={{ height: "600px", width: "800px" }}>
              <LeafletMap
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
                  attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
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
              </LeafletMap>
            </div>
          )}

        </form>
      </div>
    </div>
  );
};
