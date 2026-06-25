package com.bold.application.dto;

public class ReservationRecordResponse {

    private String title;
    private String author;
    private String reserver;
    private String reservationDate;
    private String shelfNumber;
    private String tierNumber;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getReserver() {
        return reserver;
    }

    public void setReserver(String reserver) {
        this.reserver = reserver;
    }

    public String getReservationDate() {
        return reservationDate;
    }

    public void setReservationDate(String reservationDate) {
        this.reservationDate = reservationDate;
    }

    public String getShelfNumber() {
        return shelfNumber;
    }

    public void setShelfNumber(String shelfNumber) {
        this.shelfNumber = shelfNumber;
    }

    public String getTierNumber() {
        return tierNumber;
    }

    public void setTierNumber(String tierNumber) {
        this.tierNumber = tierNumber;
    }
}
