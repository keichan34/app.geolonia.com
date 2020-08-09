import React from "react";
import fetch from "../../../lib/fetch";
import { connect } from "react-redux";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import moment from "moment";
import { __ } from "@wordpress/i18n";

type OwnProps = {};
type StateProps = {
  session: Geolonia.Session;
  teamId?: string;
  language: string;
};
type Props = OwnProps & StateProps;

const useInvoices = (props: Props) => {
  const { session, teamId } = props;
  const [loaded, setLoaded] = React.useState(false);
  const [invoices, setInvoices] = React.useState<Geolonia.Invoice[]>([]);

  // チーム変えたらロード状態をリセット
  React.useEffect(() => {
    setLoaded(false);
    setInvoices([]);
  }, [teamId]);

  React.useEffect(() => {
    if (loaded) {
      return;
    } else {
      fetch(
        session,
        `https://api.app.geolonia.com/${process.env.REACT_APP_STAGE}/teams/${teamId}/invoices`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        }
      )
        .then(res => {
          if (res.status < 400) {
            return res.json();
          } else {
            console.error(res);
            // throw new Error();
          }
        })
        .then(result => {
          if (result) {
            setInvoices(result.data);
          }
        })
        .catch(error => {
          console.error(error);
        })
        .finally(() => {
          setLoaded(true);
        });
    }
  }, [session, teamId, loaded, invoices]);

  return { invoices, loaded };
};

function PaymentHistory(props: Props) {
  const { invoices, loaded } = useInvoices(props);
  const formatter = (currency: string) =>
    new Intl.NumberFormat(props.language, {
      style: "currency",
      currency
    });

  if (loaded && invoices.length === 0) {
    return <p>{__("No payment history.")}</p>;
  }

  // const currentBalance =
  //   invoices[0] && invoices[0].ending_balance !== null
  //     ? formatter(invoices[0].currency).format(
  //         -invoices[0].ending_balance / 100
  //       )
  //     : "-";
  return (
    <Table className="payment-info">
      <TableBody>
        <TableRow>
          <TableCell component="th" scope="column">
            {__("Date")}
          </TableCell>
          <TableCell component="th" scope="column">
            {__("Payment")}
          </TableCell>
        </TableRow>
        {invoices
          .map(invoice => {
            const {
              total,
              currency,
              period_start,
              ending_balance,
              starting_balance,
              id
            } = invoice;

            // const formattedTotal = new Intl.NumberFormat(props.language, {
            //   style: "currency",
            //   currency
            // }).format(Math.abs(total) / 100);
            const value =
              (total - (ending_balance || 0) + starting_balance) / 100;
            const formattedActualPayment = formatter(currency).format(value);
            // const formattedBalanced = formatter(currency).format(
            //   ((ending_balance || 0) - starting_balance) / 100
            // );

            return {
              date: moment(period_start * 1000).format("YYYY-MM-DD"),
              total,
              payment: formattedActualPayment,
              id,
              value
            };
          })
          .filter(data => data.total > 0 && data.value > 0)
          .map(data => {
            const { id, date, payment } = data;
            return (
              <TableRow key={id}>
                <TableCell>{date}</TableCell>
                <TableCell>{payment}</TableCell>
              </TableRow>
            );
          })}
      </TableBody>
    </Table>
  );
}

export const mapStateToProps = (state: Geolonia.Redux.AppState): StateProps => {
  const team = state.team.data[state.team.selectedIndex];
  const language = state.userMeta.language;
  const { session } = state.authSupport;
  if (team) {
    const { teamId } = team;
    return {
      session,
      teamId,
      language
    };
  } else {
    return { session, language };
  }
};

export default connect(mapStateToProps)(PaymentHistory);
