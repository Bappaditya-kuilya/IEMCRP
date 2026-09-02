package com.iemcrp.dto;

import java.time.LocalDate;

public class AttendanceResponse {
    private LocalDate date;
    private String status;

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
