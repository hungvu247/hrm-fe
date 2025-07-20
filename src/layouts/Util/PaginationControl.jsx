import React from "react";
import { Grid, Dropdown, Pagination, Segment } from "semantic-ui-react";

export default function PaginationControl({
                                              currentPage,
                                              totalPages,
                                              pageSize,
                                              onPageChange,
                                              onPageSizeChange,
                                          }) {
    const pageSizeOptions = [
        { key: 10, value: 10, text: "10 / page" },
        { key: 20, value: 20, text: "20 / page" },
        { key: 50, value: 50, text: "50 / page" },
    ];

    return (
        <Segment textAlign="center" style={{ marginTop: "20px" }}>
            <Grid>
                <Grid.Column width={6} textAlign="left">
                    <Dropdown
                        selection
                        options={pageSizeOptions}
                        value={pageSize}
                        onChange={(e, { value }) => {
                            onPageSizeChange(value);
                            onPageChange(1); // reset page nếu đổi pageSize
                        }}
                    />
                </Grid.Column>

                <Grid.Column width={10} textAlign="right">
                    <Pagination
                        activePage={currentPage}
                        totalPages={totalPages}
                        onPageChange={(e, { activePage }) => onPageChange(activePage)}
                        boundaryRange={1}
                        siblingRange={1}
                        ellipsisItem={{ content: "...", icon: "ellipsis horizontal" }}
                        firstItem={{ content: "«", icon: "angle double left" }}
                        lastItem={{ content: "»", icon: "angle double right" }}
                        prevItem={{ content: "‹", icon: "angle left" }}
                        nextItem={{ content: "›", icon: "angle right" }}
                    />
                </Grid.Column>
            </Grid>
        </Segment>
    );
}
