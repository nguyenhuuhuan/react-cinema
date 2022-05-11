import React, { useState } from "react";
import { storage, UserAccount } from "uione";
import { getLocations } from "../../backoffice/service";
import { LocationRate } from "../../backoffice/service/location-rate/location-rate";
export const PostRateForm = (props: any) => {
  const [review, setReview] = useState("");
  const locationService = getLocations();
  const [resource] = useState(storage.resource().resource());
  const closeModal = (index: any) => {
    props.closeModal(index);
  };
  const handleChange = (event: any) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    setReview(value);
  };
  const renderRateStar = (value: any) => {
    let list5 = Array(5);
    list5 = list5.fill(<i />);

    const listClass = [];
    for (let i = 1; i <= value; i++) {
      listClass.push(`star-${i}`);
    }
    const longClass = listClass.join(" ");
    const divStar = <div className={`rv-star3 ${longClass}`}>{list5}</div>;
    return divStar;
  };
  const postReview = async (event: any) => {
    try {
      event.preventDefault();
      const user: UserAccount = JSON.parse(sessionStorage.getItem('authService')||'{}') as UserAccount;
      const locationRate: LocationRate = {};
      locationRate.locationId = props.location.id;
      locationRate.userId = user.id;
      locationRate.rate = props.value;
      locationRate.review = review;
      locationRate.rateTime=   new Date();
      await locationService.rateLocation(locationRate);
      storage.message("Your review is submited");
      closeModal(1);
      props.loadData();
    } catch (err) {
      storage.alert("error");
    }
  };
  return (
    <div className="view-container">
      <form
        id="addNewRate"
        name="addNewRate"
        model-name="addNewRate"
        // ref="form"
      >
        <header>
          <button
            type="button"
            id="btnClose"
            name="btnClose"
            className="btn-close"
            onClick={() => closeModal(1)}
          />
          <h2>{props.location.locationName}</h2>
        </header>
        <div>
          <section className="user-title">
            <span>
              <b>{resource.user_name}</b>
            </span>
          </section>
          <section className="user-star">
            {renderRateStar(props.value)}
          </section>
          <section className="user-input">
            <textarea
              className="rateReview"
              id="review"
              name="review"
              onChange={handleChange}
              value={review}
              placeholder={resource.placeholder_text}
            />
          </section>
          <section className="user-input">
            <div className="takePhoto">
              <button className="addPhoto">
                <i className="camera" />
                <i className="text-camera">{resource.add_photo_btn}</i>
              </button>
            </div>
          </section>
        </div>
        <footer>
          <button
            type="submit"
            id="btnSave"
            name="btnSave"
            onClick={(event) => postReview(event)}
          >
            Post
          </button>
        </footer>
      </form>
    </div>
  );
};
